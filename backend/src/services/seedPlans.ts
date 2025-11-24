import { SubscriptionPlanModel } from './../models/SubscriptionPlan';

const plans = [
  { name: 'Basic', max_users: 5, max_files: 5, price: 0 },
  { name: 'Professional', max_users: 15, max_files: 15, price: 100 },
  { name: 'Enterprise', max_users: 30, max_files: 30, price: 300 },
];

export async function seedPlans() {
  try {
    console.log('Seeding plans...');

    for (const plan of plans) {
      const result = await SubscriptionPlanModel.updateOne(
        { name: plan.name },
        { $set: plan },
        { upsert: true }
      );

      if (result.upsertedCount) console.log(`Created plan: ${plan.name}`);
      else console.log(`Updated plan: ${plan.name}`);
    }

    console.log('Seed plans done.');
  } catch (err) {
    console.error('Seeding plans failed:', err);
  }
}
