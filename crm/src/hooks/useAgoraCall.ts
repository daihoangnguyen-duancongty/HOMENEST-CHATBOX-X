import { useState, useEffect, useCallback, useRef } from 'react';
import AgoraRTC, {
  type IAgoraRTCClient,
  type ILocalAudioTrack,
  type IRemoteAudioTrack,
  type IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { useSocketStore } from '../store/socketStore';

// 🧩 Tự định nghĩa type user remote
interface IRemoteUser {
  uid: string | number;
  hasAudio: boolean;
  hasVideo: boolean;
  audioTrack?: IRemoteAudioTrack | null;
  videoTrack?: IRemoteVideoTrack | null;
}

interface JoinParams {
  appId: string;
  channelName: string;
  token: string;
  uid: string | number;
  role: 'guest' | 'telesale' | 'admin';
}

/**
 * useAgoraCall – dùng cho cả CRM & Mini App
 */
export const useAgoraCall = () => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [users, setUsers] = useState<IRemoteUser[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const localAudioRef = useRef<ILocalAudioTrack | null>(null);
  const { socket } = useSocketStore();

  const joinChannel = useCallback(async (params: JoinParams) => {
    const { appId, channelName, token, uid, role } = params;
    console.log('🎧 [Agora Join Request]', { appId, channelName, uid, role });

    if (client) {
      console.log('♻️ Rời kênh cũ...');
      await client.leave().catch(() => {});
    }

    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);

    await agoraClient.join(appId, channelName, token, uid);
    console.log('✅ Đã join channel:', channelName);

    if (role !== 'guest') {
      const track = await AgoraRTC.createMicrophoneAudioTrack({ encoderConfig: 'high_quality' });
      await agoraClient.publish([track]);
      localAudioRef.current = track;
      setIsPublishing(true);
      console.log('🎙️ Đã publish micro');
    }

    // 🧩 Lắng nghe remote users
    agoraClient.on('user-published', async (user, mediaType) => {
      await agoraClient.subscribe(user, mediaType);
      if (mediaType === 'audio') user.audioTrack?.play();

      const newUser: IRemoteUser = {
        uid: user.uid,
        hasAudio: !!user.audioTrack,
        hasVideo: !!user.videoTrack,
        audioTrack: user.audioTrack,
        videoTrack: user.videoTrack,
      };

      setUsers((prev) => [...prev.filter((u) => u.uid !== user.uid), newUser]);
      console.log('👤 User join:', user.uid);
      socket?.emit('user_joined_channel', { channelName, uid: user.uid });
    });

    agoraClient.on('user-unpublished', (user) => {
      setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      console.log('👋 User left:', user.uid);
      socket?.emit('user_left_channel', { channelName, uid: user.uid });
    });

    agoraClient.on('connection-state-change', (cur, prev) => {
      console.log('🔄 Connection change:', prev, '→', cur);
    });

    setIsJoined(true);
  }, [client, socket]);

  const leaveChannel = useCallback(async () => {
    if (!client) return;

    try {
      console.log('📴 Rời kênh Agora...');
      if (localAudioRef.current) {
        localAudioRef.current.stop();
        localAudioRef.current.close();
        localAudioRef.current = null;
      }

      await client.leave();
      setClient(null);
      setUsers([]);
      setIsJoined(false);
      setIsPublishing(false);

      socket?.emit('user_left_channel', { reason: 'manual_leave' });
      console.log('✅ Đã rời kênh');
    } catch (err) {
      console.error('❌ Lỗi khi leave channel:', err);
    }
  }, [client, socket]);

  useEffect(() => {
    return () => {
      leaveChannel();
    };
  }, [leaveChannel]);

  return {
    client,
    users,
    isJoined,
    isPublishing,
    joinChannel,
    leaveChannel,
  };
};
