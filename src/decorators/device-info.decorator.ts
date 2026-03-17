import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  useAgent: string;
}

export const DeviceInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext): DeviceInfo => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'] || '';
    console.log(userAgent);

    return {
      type: getDeviceType(userAgent),
      os: getOS(userAgent),
      browser: getBrowser(userAgent),
      useAgent: userAgent,
    };
  },
);

function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getOS(ua: string): string {
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac/i.test(ua)) return 'MacOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/ios|iphone|ipad/i.test(ua)) return 'iOS';
  return 'Unknown';
}

function getBrowser(ua: string): string {
  if (/chrome/i.test(ua)) return 'Chrome';
  if (/firefox/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua)) return 'Safari';
  if (/edge/i.test(ua)) return 'Edge';
  return 'Unknown';
}
