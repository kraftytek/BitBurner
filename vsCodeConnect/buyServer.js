/** @param {NS} ns */
import * as help from './helper.js';
export async function main(ns) {
  ns.tail("buyServer.js");
  ns.clearLog("buyServer.js");

  var list = ["disableLog", "getServerMoneyAvailable", "getPurchasedServerCost", "scan"];

  for (var x = 0; x < list.length; x++) {
    ns.disableLog(list[x]);
  }

  var serList = ns.scan("home");
  var serCount = 0;
  for (var y = 0; y < serList.length; y++) {
    if (serList[y].includes("kraftServer") == true) {
      serCount++;
    }
  }
  ns.print("Server Count: " + serCount);

  var serName = "kraftServer" + (serCount + 1);
  var homeMoney = ns.getServerMoneyAvailable("home");

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  for (var i = 1; i < 25; i++) {

    var powerOf = i;
    var maxPow = Math.pow(2, powerOf);

    if (ns.getPurchasedServerCost(maxPow) >= homeMoney || maxPow > 524289) {
      var buyAmt = Math.pow(2, (powerOf - 1));
      ns.print("Total Ram: " + buyAmt);
      var totalCost = ns.getPurchasedServerCost(buyAmt);
      var totalFormat = formatter.format(totalCost);
      ns.print("Server Name: " + serName);
      ns.print("Total Cost " + totalFormat);
      var nextCost = ns.getPurchasedServerCost(maxPow);
      ns.print("Next upgrade at " + formatter.format(nextCost));

      const buyAmtIn = 524288;
      //const buyAmtIn = 131072;

      if (buyAmt == buyAmtIn) {

        const scriptName = "weaken.js";
        //buy the next server
        await ns.purchaseServer(serName, buyAmt);
        //copy the weaken and helper scripts
        await ns.scp(scriptName, serName, "home");
        await ns.scp("helper.js", serName, "home");
        //get max thread count for running the script
        var threadCount = await help.threadCount(ns, serName, scriptName, 0);
        await ns.exec(scriptName, serName, threadCount);
      }
      break;
    }
  }
}