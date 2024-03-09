/** @param {NS} ns */

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/********************************************************************************************************************************************
                                                          Create a list of all servers
*********************************************************************************************************************************************/
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
/********************************************************************************************************************************************
                                                              Buy available programs
*********************************************************************************************************************************************/
export function buyPrograms(ns) {
  //BruteSSH.exe 500k
  //FTPCrack.exe 1.5M
  //relaySMTP.exe 5M
  //HTTPWorm.exe 30M
  //SQLInject.exe 250M

  //buy the tor server
  ns.singularity.purchaseTor();

  var programList = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];

  var currentMoney = ns.getServerMoneyAvailable("home");

  const bruteCost = 500000;
  const ftpCost = 1500000;
  const relayCost = 5000000;
  const httpCost = 30000000;
  const sqlCost = 250000000;

  var progCostList = [bruteCost, ftpCost, relayCost, httpCost, sqlCost];

  for (var t = 0; t < progCostList.length; t++) {
    if (currentMoney >= progCostList[t]) {
      ns.singularity.purchaseProgram(programList[t]);
    }
  }
}
/********************************************************************************************************************************************
                                                                  Open all Nodes
*********************************************************************************************************************************************/
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
/********************************************************************************************************************************************
                                                            Determine Max thread count 
*********************************************************************************************************************************************/
export function threadCount(ns, serverName, scriptName, reserve) {
  var server = serverName;
  var script = scriptName;
  var reserve = reserve
  var scriptCost = ns.getScriptRam(script);
  var availRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  var threads = Math.floor((availRam - reserve) / scriptCost);
  return threads;
}
/********************************************************************************************************************************************
                                                            Nuke all the servers we can
*********************************************************************************************************************************************/
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
/********************************************************************************************************************************************
                                                      returns true if a server can be hacked
*********************************************************************************************************************************************/
export function canWeHack(ns, serverName) {
  var currentServer = serverName;
  if (ns.hasRootAccess(currentServer) == true) {
    if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(currentServer)) {
      return true;
    }
  }
}
/********************************************************************************************************************************************
                                                              Weaken or Grow Servers
*********************************************************************************************************************************************/
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
/********************************************************************************************************************************************
                                                            Total Cash on hackable servers
*********************************************************************************************************************************************/
export async function totalCash(ns) {

  var serList = serverList(ns);
  var totalMoney = 0.0;

  for (var x = 0; x < serList.length; x++) {
    if (canWeHack(ns, serList[x])) {
      var serverCash = ns.getServerMoneyAvailable(serList[x]);
      totalMoney += serverCash;
    }
  }
  return formatter.format(totalMoney);
}
/********************************************************************************************************************************************
                                                                gang stuff
*********************************************************************************************************************************************/

/** @param {NS} ns */
export async function doGang(ns) {
  //buy gang members
  //buy equipment
  //ascend when specific criteria is met

  ns.tail("allGang.js");

  var disableList = ["sleep", "gang.getEquipmentNames", "gang.getEquipmentCost", "gang.purchaseEquipment", "gang.getMemberNames", "gang.setMemberTask", "getServerMoneyAvailable"];
  for (var z = 0; z < disableList.length; z++) {
    ns.disableLog(disableList[z]);
  }
  /****************************Member Recruitment****************************/

  //member name list
  const memberNames = ["Luffy", "Zoro", "Sanji", "Nami", "Robin", "Chopper", "Usopp", "Franky", "Brooks", "Jimbe", "Ace", "Kraft"];
  //get current Gang member names
  var gangMembers = ns.gang.getMemberNames();
  //index for cycling through name list
  var currentNameIndex = 0;
  //true if a member can be recruited
  var recruitCheck = ns.gang.canRecruitMember();

  //check what names from list are already used and remove them from list

  for (var x = 0; x < memberNames.length; x++) {
    for (var y = 0; y < gangMembers.length; y++) {
      var member = gangMembers[y];
      if (memberNames.includes(member)) {
        var nameIndex = memberNames.indexOf(member);
        memberNames.splice(nameIndex, 1);
      }
    }
  }
  //If a member can be recruited and we can afford them, recruit then with current name and add 1 to index

  if (recruitCheck == true) {
    ns.gang.recruitMember(memberNames[currentNameIndex]);
    currentNameIndex += 1;
  }
  /********************************Set member to task************************************/

  var currentMemberList = ns.gang.getMemberNames();

  for (var x = 0; x < currentMemberList.length; x++) {

    var currentMember = currentMemberList[x];
    var memberStats = ns.gang.getMemberInformation(currentMember);
    var memberStr = memberStats.str;
    var memberAgi = memberStats.agi;
    var memberDef = memberStats.def;
    var memberDex = memberStats.dex;
    var memberCha = memberStats.cha;
    var memberHack = memberStats.hack;
    var gangStats = ns.gang.getGangInformation();


    if (gangStats.wantedLevel > 500) {
      ns.gang.setMemberTask(currentMember, "Vigilante Justice")
    }
    else if (memberStr < 100) {
      ns.gang.setMemberTask(currentMember, "Train Combat");
    }
    else if (memberStr > 1200) {
      ns.gang.setMemberTask(currentMember, "Human Trafficking");
    }
    else if (memberStr > 300) {
      ns.gang.setMemberTask(currentMember, "Strongarm Civilians");
    }
    else if (memberStr > 100) {
      ns.gang.setMemberTask(currentMember, "Mug People");
    }
  }
  /****************************Buy equipment for gang members****************************/

  var equipList = ns.gang.getEquipmentNames();
  var currentMoney = ns.getServerMoneyAvailable('home');
  var gangMembers = ns.gang.getMemberNames();

  for (var x = 0; x < gangMembers.length; x++) {
    var memberName = gangMembers[x];

    for (var i = 0; i < equipList.length; i++) {
      var equipCost = ns.gang.getEquipmentCost(equipList[i]);
      var equipName = equipList[i].toString();
      if (equipCost <= currentMoney) {
        ns.gang.purchaseEquipment(memberName, equipName);
      }
    }
  }
  /************************************Ascend members************************************/
  //Get list of gang members
  var gangMembers = ns.gang.getMemberNames();
  //loop through all members
  for (var x = 0; x < gangMembers.length; x++) {

    var memberName = gangMembers[x];

    let ascStats = ns.gang.getAscensionResult(memberName);
    // if value returned is not defined, skip that member this round
    if (ascStats.str === undefined) {
      return
    }
    if (ascStats.def === undefined) {
      return
    }
    if (ascStats.dex === undefined) {
      return
    }

    ns.print(memberName + ": Str = " + ascStats.str.toFixed(2) + ", Def = " + ascStats.def.toFixed(2) + ", Dex = " + ascStats.dex.toFixed(2));
    //if str, def, and dex are all 2X multipliers then ascend member
    if (ascStats.str >= 2 && ascStats.def >= 2 && ascStats.dex >= 2) {
      ns.gang.ascendMember(memberName);
      ns.print(memberName + " has Ascended!");
    }
    await ns.sleep(20);
  }
}
/********************************************************************************************************************************************
                                                              Manage Sleeves
*********************************************************************************************************************************************/
export async function manageSleeves(ns) {

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
      if (sleeveStr < 300) {
        ns.sleeve.setToCommitCrime("Mug");
        ns.print("Sleeve " + x + " set to commit Mug!");
      }
      else {
        ns.sleeve.setToCommitCrime("Homicide");
        ns.print("Sleeve " + x + " set to commit Homicide!");
      }
    }
  }
}
/********************************************************************************************************************************************
                                                              Buy Server
*********************************************************************************************************************************************/
/*
export async function buyServer(ns) {

  var homeMoney = ns.getServerMoneyAvailable("home");
  var serList = ns.scan("home");
  var serCount = 0;
  var serName = "kraftServer" + (serCount + 1);
  
  for (var y = 0; y < serList.length; y++) {
    if (serList[y].includes("kraftServer") == true) {
      serCount++;
    }
  }
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
        var threadcount = threadCount(ns, serName, scriptName, 0);
        await ns.exec(scriptName, serName, threadcount);
        ns.print("Purchased Surver #" + (serCount + 1));
      }
      break;
    }
  }
  return serCount;
}
*/
/********************************************************************************************************************************************
                                                            Hacknet nodes
*********************************************************************************************************************************************/
