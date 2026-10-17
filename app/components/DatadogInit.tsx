"use client";

import { datadogRum } from "@datadog/browser-rum";
import { reactPlugin } from "@datadog/browser-rum-react";
import { useEffect } from "react";

let started = false;

export default function DatadogInit() {
  useEffect(() => {
    if (started) return;

    const applicationId = process.env.NEXT_PUBLIC_DD_APPLICATION_ID;
    const clientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;
    const site = process.env.NEXT_PUBLIC_DD_SITE || "us5.datadoghq.com";

    if (!applicationId || !clientToken) return;

    datadogRum.init({
      applicationId,
      clientToken,
      site,
      service: "nova-track",
      env: process.env.NEXT_PUBLIC_DD_ENV || "prod",
      version: process.env.NEXT_PUBLIC_DD_VERSION || "1.0.0",
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackResources: true,
      trackUserInteractions: true,
      trackLongTasks: true,
      defaultPrivacyLevel: "mask-user-input",
      plugins: [reactPlugin()],
    });

    started = true;
  }, []);

  return null;
}
