import { Text } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SetScoreResponse, LeaderboardAPI, GetAllLeaderboardsResponse } from 'ZEPETO.Script.Leaderboard';

export default class LeaderboardLayoutManager extends ZepetoScriptBehaviour {

    public leaderboardId: string = "";
    public resetText: Text;

    Start() {        

    }

    private SetSeasonText(){
        LeaderboardAPI.GetAllLeaderboards(this.OnResult, this.OnError);
    }

    private OnResult(result: GetAllLeaderboardsResponse) {
        console.log(`result.isSuccess: ${result.isSuccess}`);

        if (result.leaderboards) {
            for (let i = 0; i < result.leaderboards.length; ++i) {
                const leaderboard = result.leaderboards[i];
                console.log(`i: ${i}, id: ${leaderboard.id}, name: ${leaderboard.name} , resetRule: ${leaderboard.resetInfoList[0].resetRule}`);

                switch (leaderboard.resetInfoList[0].resetRule) {
                    case 1: //Day
                        this.resetText.text = "End of Season : Every" + leaderboard.resetInfoList[0].hour, leaderboard.resetInfoList[0].min;
                        break;
                    case 2: // Week
                        this.resetText.text= "End of Season : Every" + leaderboard.resetInfoList[0].weekDay, + leaderboard.resetInfoList[0].hour, leaderboard.resetInfoList[0].min;
                        break;
                    case 3: // Month
                        this.resetText.text = "End of Season : Every" + leaderboard.resetInfoList[0].day, + leaderboard.resetInfoList[0].hour, leaderboard.resetInfoList[0].min;
                        break;
                    default:
                        this.resetText.text = "No reset Rule";
                        break;
                }

            }
        }
    }

    private OnError(error: string) {
        console.error(error);
    }



}