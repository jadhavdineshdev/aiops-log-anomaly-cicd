const assert = require("assert");
const { detectAnomalies } = require("./detector");

// Test 1: Normal steady-state logs produce zero anomalies
const normalLogs = [
  { latency_ms: 40 }, { latency_ms: 42 }, { latency_ms: 41 }, { latency_ms: 43 }
];
const resNormal = detectAnomalies(normalLogs);
assert.strictEqual(resNormal.filter(r => r.isAnomaly).length, 0);
console.log("PASS: Test 1 - Steady-state baseline check");

// Test 2: Severe latency spike is accurately flagged
const spikeLogs = [
  { latency_ms: 42 }, { latency_ms: 44 }, { latency_ms: 41 }, { latency_ms: 43 },
  { latency_ms: 45 }, { latency_ms: 42 }, { latency_ms: 44 }, { latency_ms: 41 },
  { latency_ms: 520 }
];
const resSpike = detectAnomalies(spikeLogs);
const flagged = resSpike.filter(r => r.isAnomaly);
assert.strictEqual(flagged.length, 1);
assert.strictEqual(flagged[0].latency_ms, 520);
console.log("PASS: Test 2 - High-latency anomaly detection check");

// Test 3: Zero-variance constant stream edge case
const flatLogs = [{ latency_ms: 50 }, { latency_ms: 50 }, { latency_ms: 50 }];
assert.strictEqual(detectAnomalies(flatLogs)[0].zScore, 0);
console.log("PASS: Test 3 - Zero-variance edge case");

// Test 4: Empty input handling
assert.deepStrictEqual(detectAnomalies([]), []);
console.log("PASS: Test 4 - Empty payload handling");
console.log("ALL 4 AIOPS UNIT TESTS PASSED (100%).");
