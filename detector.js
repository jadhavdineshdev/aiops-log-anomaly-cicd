function detectAnomalies(logs, zThreshold = 2.5) {
  if (!Array.isArray(logs) || logs.length === 0) return [];
  const values = logs.map(l => l.latency_ms);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(
    values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length
  );

  return logs.map(entry => {
    const zScore = std === 0 ? 0 : Math.abs((entry.latency_ms - mean) / std);
    return {
      ...entry,
      baselineMean: Number(mean.toFixed(2)),
      zScore: Number(zScore.toFixed(2)),
      isAnomaly: zScore > zThreshold
    };
  });
}

if (require.main === module) {
  const mode = process.argv[2] || "--default";
  const sampleLogs = [
    { ts: "2026-11-15T10:00:00Z", service: "auth-api", latency_ms: 42 },
    { ts: "2026-11-15T10:01:00Z", service: "auth-api", latency_ms: 45 },
    { ts: "2026-11-15T10:02:00Z", service: "auth-api", latency_ms: 41 },
    { ts: "2026-11-15T10:03:00Z", service: "auth-api", latency_ms: 44 },
    { ts: "2026-11-15T10:04:00Z", service: "auth-api", latency_ms: 43 },
    { ts: "2026-11-15T10:05:00Z", service: "auth-api", latency_ms: 46 },
    { ts: "2026-11-15T10:06:00Z", service: "auth-api", latency_ms: 42 },
    { ts: "2026-11-15T10:07:00Z", service: "auth-api", latency_ms: 44 },
    { ts: "2026-11-15T10:08:00Z", service: "auth-api", latency_ms: 480 }
  ];
  const results = detectAnomalies(sampleLogs);
  const alerts = results.filter(r => r.isAnomaly);
  console.log(`[MODE: ${mode}] Processed ${results.length} logs | Anomalies Detected: ${alerts.length}`);
  console.log(JSON.stringify(alerts, null, 2));
}

module.exports = { detectAnomalies };
