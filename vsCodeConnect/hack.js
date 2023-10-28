/** @param {NS} ns */
export async function main(ns) {

  while(true){
  var serName = ns.getHostname();
  if (ns.hasRootAccess(serName) == true) {
    await ns.hack(serName);
    await ns.sleep(30);
  }
}
await ns.sleep(5);
}
