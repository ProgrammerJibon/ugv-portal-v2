<?php


function generateFingerprint()
{
    $userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Mozilla/5.0 (X11; Linux x86_64)",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X " . rand(7, 10) . "_15_7)",
        "Mozilla/5.0 (Android " . rand(10, 15) . "; Mobile)",
        "Mozilla/5.0 (iPhone; CPU iPhone OS " . rand(10, 16) . "_0 like Mac OS X)"
    ];

    $languages = [
        "en-US,en;q=0.9",
        "en-GB,en;q=0.8",
        "bn-BD,bn;q=0.9,en;q=0.7",
        "fr-FR,fr;q=0.9",
        "de-DE,de;q=0.9"
    ];

    $platforms = [
        "WINNT",
        "Linux",
        "Darwin",
        "Android",
        "iOS"
    ];

    $timezones = DateTimeZone::listIdentifiers(DateTimeZone::ALL);


    $fingerprint = [
        "userAgent" => $userAgents[array_rand($userAgents)],
        "language" => $languages[array_rand($languages)],
        "colorDepth" => rand(16, 32),
        "screenResolution" => rand(1280, 2560) . "x" . rand(720, 1440),
        "timezone" => $timezones[array_rand($timezones)],
        "platform" => $platforms[array_rand($platforms)],
        "canvasHash" => substr(base64_encode(random_bytes(32)), 0, 50),
        "plugins" => rand(0, 5),
        "hardwareConcurrency" => rand(2, 16),
        "deviceMemory" => rand(2, 16),
        "touchSupport" => rand(0, 1) ? "true" : "false"
    ];

    return hash("sha256", json_encode($fingerprint));
}



function randomIp()
{
    return rand(1, 223) . "." . rand(0, 255) . "." . rand(0, 255) . "." . rand(1, 254);
}

$url = "https://icpc.bubt.edu.bd/api/vote-team.php";

function ransome($team_id, $team_name)
{
    global $url;
    $dataX = [
        "team_id" => $team_id,
        "fingerprint" => generateFingerprint()
    ];

    $data = json_encode($dataX);

    // echo $data . "\n";
    // continue;
    // exit();


    $fakeIp = randomIp();

    $headers = [
        "Accept: */*",
        "Accept-Language: en-US,en;q=0.9,bn;q=0.8",
        "Content-Type: application/json",
        "DNT: 1",
        "Origin: https://icpc.bubt.edu.bd",
        "Priority: u=1, i",
        "Referer: https://icpc.bubt.edu.bd/vote-share.php?team_id=" . $dataX["team_id"],
        "Sec-CH-UA: \"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
        "Sec-CH-UA-Mobile: ?0",
        "Sec-CH-UA-Platform: \"Android\"",
        "Sec-Fetch-Dest: empty",
        "Sec-Fetch-Mode: cors",
        "Sec-Fetch-Site: same-origin",
        "User-Agent: Mozilla/5.1 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 CrKey/1.54.248666",
        "X-Forwarded-For: " . $fakeIp,
        "Client-IP: " . $fakeIp,
        "X-Real-IP: " . $fakeIp
    ];

    $context = stream_context_create([
        "http" => [
            "method" => "POST",
            "header" => implode("\r\n", $headers),
            "content" => $data,
            "ignore_errors" => true
        ]
    ]);

    $response = file_get_contents($url, false, $context);
    return @json_decode($response, true);
}


$target_id = "1110805";
date_default_timezone_set('Asia/Dhaka');

$runTime = 0;
$runTime = 1766129106;

$result = "";

if(time() > $runTime){
    $result .= "Started at " . date("Y-m-d H:i:s", $runTime) . "\n\n\n";

    $teams = file_get_contents(__DIR__ . "/teams-icpc.json");
    $teamsArr = json_decode($teams, true);
    
    foreach ($teamsArr as $team) {
        if ($team['team_id'] == $target_id) {
            while (true) {
                if ($ransome = ransome($team['team_id'], $team['team_name'])) {
                    if (!$ransome['success']) {
                        $result .= "Failed: " . $ransome['message'] . ".\nTime: " . date("Y-m-d H:i:s") . "\n\n\n";
                        break;
                    }else{
                        $result .= "Voted for Team " . $team['team_name'] . ". Time: ". date("Y-m-d H:i:s") . " \n\n\n";
                    }
                }
            }
            break;
        }
    }
} else {
    // update time 
    $result .= "Current time is " . date("Y-m-d H:i:s") . "\n";
    $result .= "Waiting to start at " . date("Y-m-d H:i:s", $runTime) . "\n";
}


file_put_contents(__DIR__ . "/result.txt", $result);