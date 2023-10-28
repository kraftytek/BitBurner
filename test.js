//import * as help from './helper.js';
/** @param {NS} ns */
export async function main(ns) {

  ns.tail("test.js");

  var sleeveCnt = ns.sleeve.getNumSleeves();

  for (var x = 0; x < sleeveCnt; x++) {
    var sleevestat = ns.sleeve.getSleeve(x);
    var sleeveShock = sleevestat.shock;

    if (sleeveShock.toFixed(2) < 100) {
      ns.print("Sleeve " + x + " still recovering from shock!");
      ns.print("Current Shock " + sleevestat.shock.toFixed(2) + "%");
    }
    else {
      var sleeveStr = ns.sleevestat.strength;
      if(sleeveStr < 300){
        ns.sleeve.setToCommitCrime("Mug");
      }
      else {
        ns.sleeve.setToCommitCrime("Homicide");
      }
    }
  }
}