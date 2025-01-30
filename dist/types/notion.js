"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Origin = exports.VoteStatus = exports.TimelineStatus = exports.Chain = void 0;
var Chain;
(function (Chain) {
    Chain["Polkadot"] = "Polkadot";
    Chain["Kusama"] = "Kusama";
})(Chain || (exports.Chain = Chain = {}));
var TimelineStatus;
(function (TimelineStatus) {
    TimelineStatus["LeadIn"] = "Lead-in";
    TimelineStatus["Submitted"] = "Submitted";
    TimelineStatus["Deciding"] = "Deciding";
    TimelineStatus["Confirmation"] = "Confirmation";
    TimelineStatus["Enactment"] = "Enactment";
    TimelineStatus["TimedOut"] = "TimedOut";
    TimelineStatus["Executed"] = "Executed";
})(TimelineStatus || (exports.TimelineStatus = TimelineStatus = {}));
var VoteStatus;
(function (VoteStatus) {
    VoteStatus["NotStarted"] = "Not started";
    VoteStatus["Considering"] = "Considering";
    VoteStatus["Debating"] = "Debating";
    VoteStatus["Waiting"] = "Waiting";
    VoteStatus["VotedAye"] = "Voted \uD83D\uDC4D Aye \uD83D\uDC4D";
    VoteStatus["VotedAbstain"] = "Voted \u270C\uFE0F Abstain \u270C\uFE0F";
    VoteStatus["VotedNay"] = "Voted \uD83D\uDC4E Nay \uD83D\uDC4E";
    VoteStatus["NotVoted"] = "Not Voted";
})(VoteStatus || (exports.VoteStatus = VoteStatus = {}));
var Origin;
(function (Origin) {
    Origin["Root"] = "0 - Root";
    Origin["WhitelistedCaller"] = "1 - Whitelisted Caller";
    Origin["WishForChange"] = "2 - Wish For Change";
    Origin["StakingAdmin"] = "10 - Staking Admin";
    Origin["Treasurer"] = "11 - Treasurer";
    Origin["LeaseAdmin"] = "12 - Lease Admin";
    Origin["FellowshipAdmin"] = "13 - Fellowship Admin";
    Origin["GeneralAdmin"] = "14 - General Admin";
    Origin["AuctionAdmin"] = "15 - Auction Admin";
    Origin["ReferendumCanceller"] = "20 - Referendum Canceller";
    Origin["ReferendumKiller"] = "21 - Referendum Killer";
    Origin["SmallTipper"] = "30 - Small Tipper";
    Origin["BigTipper"] = "31 - Big Tipper";
    Origin["SmallSpender"] = "32- Small Spender";
    Origin["MediumSpender"] = "33 - Medium Spender";
    Origin["BigSpender"] = "34 - Big Spender";
})(Origin || (exports.Origin = Origin = {}));
