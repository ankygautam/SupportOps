import { demoAccountConfigs, type DemoAccountConfig } from "@/app/config/demo";

export type DemoAccount = DemoAccountConfig;

export const demoAccounts: DemoAccount[] = demoAccountConfigs;

export const defaultDemoAccount = demoAccounts[2];
