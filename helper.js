/** @param {NS} ns */

/**
gets a list of all servers
**/
export function serverList(ns) {
  ns.disableLog("ALL");
  ns.enableLog("print");
  ns.enableLog("weaken");
  ns.enableLog("grow");

  var allList = [];
  allList = ns.scan("home");

  for (var x = 0; x < allList.length; x++) {
    var innerList = ns.scan(allList[x]);
    for (var y = 0; y < innerList.length; y++) {
      if (!allList.includes(innerList[y])) {
        allList.push(innerList[y]);
      }
    }
  }
  const homeVal = allList.indexOf('home');
  if (homeVal > -1) {
    allList.splice(homeVal, 1);
  }
  return allList;
}
/**
Open Nodes
**/
export function openNodes(ns) {
  const crackNames = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
  const currentCracks = ns.ls("home");
  const crackList = [];

  for (const name of crackNames) {
    if (currentCracks.includes(name)) {
      crackList.push(name);
    }
  }

  const serList = serverList(ns);
  for (const serverName of serList) {
    if (!ns.hasRootAccess(serverName)) {
      if (crackList.length == 5) ns.sqlinject(serverName);
      if (crackList.length >= 4) ns.httpworm(serverName);
      if (crackList.length >= 3) ns.relaysmtp(serverName);
      if (crackList.length >= 2) ns.ftpcrack(serverName);
      if (crackList.length >= 1) ns.brutessh(serverName);
    }
  }
  return crackList.length;
}
/*
Thread count Calc
*/
export function threadCount(ns, serverName, scriptName) {
  var server = serverName;
  var script = scriptName;
  var scriptCost = ns.getScriptRam(script);
  var availRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  var threads = Math.floor(availRam / scriptCost);
  return threads;
}
/*
Nuke all servers we can
*/
export function nukeAll(ns) {

  var serList = serverList(ns);
  var listLen = serverList(ns).length;
  var crackCount = openNodes(ns);
  for (var x = 0; x < listLen; x++) {
    var requiredPorts = parseInt(ns.getServerNumPortsRequired(serList[x]));
    if (requiredPorts <= crackCount) {
      ns.nuke(serList[x]);
    }
  }
  return serList;
}
/*
returns true if we are able to hack a server
*/
export function canWeHack(ns, serverName) {
  var currentServer = serverName;
  if (ns.hasRootAccess(currentServer) == true) {
    if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(currentServer)) {
      return true;
    }
  }
}
/*
Weaken or grow server
*/
export async function weGrow(ns, server) {
  var currentServer = server;
  var serverMoney = ns.getServerMoneyAvailable(currentServer);

  if (serverMoney > 0) {
    await ns.grow(currentServer);
  }
  else {
    await ns.weaken(currentServer);
  }
}
/*
Hacknet nodes
*/
