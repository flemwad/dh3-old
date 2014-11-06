angular.module('dh3', [])
    .controller('DieHardController', ['$scope', '$window', '$interval', '$timeout', function ($scope, $window, $interval, $timeout) {
        //dropdown vars
        $scope.fiveGalChoice = 'Empty';
        $scope.threeGalChoice = 'Empty';
        $scope.galChoices = ['Empty', 'Fill', 'Fill From Other Jug'];

        //starting images, also expression values for ng-src data binding
        $scope.threeGalImg = 'images/empty3.png';
        $scope.fiveGalImg = 'images/empty5.png';
        $scope.mainImg = 'images/diehardfount.jpg';

        //gallon number amounts, these probably don't need to be on the scope
        $scope.threeGalAmt = 0;
        $scope.fiveGalAmt = 0;

        //init bombTimer
        $scope.bombTimer = 120;

        //convenience vars
        var hint = ' Try again? Hint: There are two possible solutions';
        var youWon = false;

        $scope.updateThreeGal = function (choice) {
            var check = $scope.endCheck();
            if(check) return;

            switch(choice) {
                case 'Empty':
                    $scope.threeGalImg = 'images/empty3.png';
                    $scope.threeGalAmt = 0;
                    break;
                case 'Fill':
                    $scope.threeGalImg = 'images/fullgal3.png';
                    $scope.threeGalAmt = 3;
                    break;
                case 'Fill From Other Jug':
                    $scope.processThreeTransfer();
                    break;
            }
        };

        $scope.processThreeTransfer = function () {
            var origAmt = $scope.threeGalAmt;
            $scope.threeGalAmt = $scope.threeGalAmt + $scope.fiveGalAmt;

            if($scope.threeGalAmt > 3) { //can't fill over 3 gals
                $scope.threeGalAmt = 3;
            }

            //new amount of five gal is what was transferred over
            $scope.fiveGalAmt = $scope.fiveGalAmt - ($scope.threeGalAmt - origAmt);

            $scope.updateImgs();
        };

        $scope.processFiveTransfer = function () {
            var origAmt = $scope.fiveGalAmt;
            $scope.fiveGalAmt = $scope.fiveGalAmt + $scope.threeGalAmt;

            if($scope.fiveGalAmt > 5) { //can't fill over 5 gals
                $scope.fiveGalAmt = 5;
            }

            //new amount of three gal is what was transferred over
            $scope.threeGalAmt = $scope.threeGalAmt - ($scope.fiveGalAmt - origAmt);

            $scope.updateImgs();
        };

        $scope.updateFiveGal = function (choice) {
            var check = $scope.endCheck();
            if(check) return;

            switch(choice) {
                case 'Empty':
                    $scope.fiveGalImg = 'images/empty5.png';
                    $scope.fiveGalAmt = 0;
                    break;
                case 'Fill':
                    $scope.fiveGalImg = 'images/fullgal5.png';
                    $scope.fiveGalAmt = 5;
                    break;
                case 'Fill From Other Jug':
                    $scope.processFiveTransfer();
                    break;
            }
        };

        $scope.endCheck = function () {
            if($scope.bombTimer == 0 && !youWon) { //timer has already expired, don't process
                $scope.showConfirm('You are already dead!');
                return true;
            }
            else if ($scope.bombTimer == 0 && youWon) {
                $scope.showConfirm('You already defused the bomb!');
                return true;
            }

            return false;
        };

        //evals jug amounts and adjusts img accordingly
        $scope.updateImgs = function () {
            //$window.alert('Five Gal is ' + $scope.fiveGalAmt.toString() + ' -- Three Gal is ' + $scope.threeGalAmt.toString());

            switch ($scope.threeGalAmt) {
                case 0:
                    $scope.threeGalImg = 'images/empty3.png';
                    break;
                case 1:
                    $scope.threeGalImg = 'images/1gal3.png';
                    break;
                case 2:
                    $scope.threeGalImg = 'images/2gal3.png';
                    break;
                case 3:
                    $scope.threeGalImg = 'images/fullgal3.png';
                    break;
            }

            switch ($scope.fiveGalAmt) {
                case 0:
                    $scope.fiveGalImg = 'images/empty5.png';
                    break;
                case 1:
                    $scope.fiveGalImg = 'images/1gal5.png';
                    break;
                case 2:
                    $scope.fiveGalImg = 'images/2gal5.png';
                    break;
                case 3:
                    $scope.fiveGalImg = 'images/3gal5.png';
                    break;
                case 4:
                    $scope.fiveGalImg = 'images/4gal5.png';
                    break;
                case 5:
                    $scope.fiveGalImg = 'images/fullgal5.png';
                    break;
            }
        };

        $scope.boom = function () {
            $scope.mainImg = 'images/diehardexplosion.png';
            $scope.showConfirm('The whole city block has been demolished, with you in it!');
        };

        $scope.timerTick = $interval(function() {
            if($scope.bombTimer == 0) {
                $scope.stopTimer();
                $scope.boom();
            }
            else {
                $scope.bombTimer--;
            }
        }, 1000, 0);

        $scope.stopTimer = function() {
            $interval.cancel($scope.timerTick); // stop the timer
            $scope.bombTimer = 0;
        };

        $scope.showConfirm = function (text) {
            var res;
            $timeout(function(){
                res = $window.confirm(text + hint)
                $window.alert(res.toString());
            }, 500);
            
            if(res == true) {
                location.reload();
            }
        };

        $scope.tryJug = function () {
            if($scope.fiveGalAmt == 4 && $scope.bombTimer != 0) { //win condition
                youWon = true;
                $scope.mainImg = 'images/diehardhappyend.jpg';
                $scope.showConfirm('You saved the day!');
                $scope.stopTimer();
            }
            else if($scope.bombTimer == 0 && !youWon) { //timer has already expired
                $scope.showConfirm('You are already dead!');
            }
            else if ($scope.bombTimer == 0 && youWon) {
                $scope.showConfirm('You already defused the bomb!');
            }
            else { //if user press it too early and the amount isn't right
                $scope.stopTimer();
                $scope.boom();
            }
        };
    }])
    .filter('secsToMins', function () { //filter to show bomb timer correctly
        return function(time) {
            //window.alert('tick'); //to debug cancelling
            var minutes = Math.floor(time / 60);
            var seconds = time - minutes * 60;
            if(seconds < 10) { //single-digit seconds only shows as one 0, so timer looked odd
                var timeString = minutes.toString() + ':0' + seconds.toString();
            }
            else {
                var timeString = minutes.toString() + ':' + seconds.toString();
            }

            return timeString;
        }
    });
