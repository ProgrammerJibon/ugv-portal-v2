<?php

$list = @file_get_contents(__DIR__ . '/UniversityList.json');

$datas = json_decode($list, true);
$public = $datas['public'];
$private = $datas['private'];
$count = 11;
$result = "";
for ($i = 0; $i < count($public); $i++) {
    $result .=  "($count, '" . addslashes($public[$i]['name']) . "', 'BD', 'PUBLIC'),\n";
    $count++;
}
for ($i = 0; $i < count($private); $i++) {
    $result .=  "($count, '" . addslashes($private[$i]['name']) . "', 'BD', 'PRIVATE'),\n";
    $count++;
}

file_put_contents(__DIR__ . '/VarsitiesToValues.txt', rtrim($result, ",\n"));