import { ReactNode } from 'react';

import { ReturnType } from '@/types';

export interface Route {
  key: string;
  component: ReactNode;
  title: string;
  icon: React.ComponentType<{ color: string }>;
}

export interface UnitTabButtonProps {
  route: Route;
  isActive: boolean;
  onPress: () => void;
  styles: ReturnType<typeof import('@/components/home/UnitTab').createStyles>;
  iconActiveColor: string;
  iconInactiveColor: string;
}

export interface UnitTabProps {
  routes: Route[];
  initialTabIndex?: number;
}
