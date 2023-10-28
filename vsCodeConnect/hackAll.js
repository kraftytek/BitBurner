/** @param {NS} ns */
import * as help from './helper.js';
export async function main(ns) {


  ns.enableLog("hack");

  var serverList = help.serverList(ns);
  var loopCount = 0;

  while (true) {

    for (var x = 0; x < serverList.length; x++) {
      var serverName = serverList[x];
      ns.print("Hacking " + serverName);
      if (help.canWeHack(ns,serverName)) {
        await ns.hack(serverName);
      }
    }
    loopCount += 1;
    ns.print("Current loop - " + loopCount);
  }
}
