import { config } from 'dotenv';
config();

import '@/ai/flows/order-update-email-alerts.ts';
import '@/ai/flows/new-order-email-alert.ts';
import '@/ai/flows/import-products-flow.ts';
import '@/ai/flows/import-users-flow.ts';
