import * as help from './helper.js';

export async function main(ns) {
  ns.enableLog("ALL");

  var serList = help.serverList(ns);
  /*
  ns.tail("grow.js");
 */
  for (var x = 0; x < serList.length; x++) {
    var currentServer = serList[x];

    if (help.canWeHack(ns, currentServer) == true) {
      await help.weGrow(ns, currentServer);
    }
  }
}