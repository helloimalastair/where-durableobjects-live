export default function (v2: ColoJSONV2): ColoJSONV1 {
  const v1: ColoJSONV1 = {};
 for (const workerColo in v2) {
    v1[workerColo] = {};
    for(const doColo in v2[workerColo]) {
      v1[workerColo][doColo] = v2[workerColo][doColo].latency;
    }
  };
  return v1;
}