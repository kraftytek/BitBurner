/** @param {NS} ns */
import * as help from './helper.js';

export async function main(ns) {
  ns.disableLog("ALL");
  ns.enableLog("print");
  ns.tail('scpHack.js');

  var loops = 0;

  while (true) {
    /*******Get a list of all the servers*******/
    var serList = help.serverList(ns);
    /*******crack all servers we can*******/
    help.openNodes(ns);
    ns.print("Applied Cracks to all Servers");
    /*******Nuke all servers we can*******/
    help.nukeAll(ns);
    ns.print("Nuked all Servers");
    /*******copy the hack script to all available servers*******/
    for (var x = 0; x < serList.length; x++) {
      var currentServer = serList[x];
      await ns.scp("hack.js", currentServer);
      /*******run as many copy of the script as you can on the server*******/
      var threads = help.threadCount(ns, currentServer, "hack.js");
      if (threads > 0) {
        if (help.canWeHack(ns, currentServer) == true) {
          ns.exec("hack.js", currentServer, threads);
        }
      }
    }
    ns.print("Hack running on all Servers");
    /*******grow or weaken each server*******/

    var threadsGrow = help.threadCount(ns, "home", "grow.js");
    if (threadsGrow > 0) {
      ns.exec("grow.js", "home", threadsGrow);
    }
    ns.print("Grow/Weaken run on home server");
    /*******Log outputs*******/
    loops += 1;
    ns.print(loops + " loops of script");
    ns.print("Sleeping...");
    await ns.sleep(30000);
    ns.clearLog();
  }
}