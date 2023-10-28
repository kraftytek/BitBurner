/** @param {NS} ns */
import * as help from './helper.js';

export async function main(ns) {

  var serverList = help.serverList(ns);
  var loopCount = 0;

  while (true) {

    for (var x = 0; x < serverList.length; x++) {
      await ns.weaken(serverList[x]);
    }
    loopCount += 1;
    ns.print("Current loop - " + loopCount);
  }
}