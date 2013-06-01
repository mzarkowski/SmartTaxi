var ST = ST || {};
ST.Geolocation = ST.Geolocation || {};
ST.Geolocation.accuracy = ST.Geolocation.minNetworkAccuracy + 1;
//częstotliwość odświeżania w ms
ST.Geolocation.getPositionFrequency = 1000;

ST.Geolocation.getPosition = function () {
    //minimalna dokładność dla GPS, w metrach
    ST.Geolocation.minAccuracy = 20.0;
    //minimalna dokładność dla nie-GPS, w metrach
    ST.Geolocation.minNetworkAccuracy = 50.0;
    //najpierw próbujemy z GPS a jak nie to z sieci
    var options = {};
    options.enableHighAccuracy = true;
    options.frequency = ST.Geolocation.getPositionFrequency;
    //jedyny sposób, żeby przejść do sieci na androidzie to timeout
    options.timeout = 5000;
    ST.Geolocation.watchID = navigator.geolocation.watchPosition(ST.Geolocation.onSuccess, ST.Geolocation.onError, options);
};

ST.Geolocation.getPositionFromNetwork = function () {
    //maximumAge 0 usuwa efekt pamięci lokalizacji, która może być po poprzednim wywołaniu watchPosition
    navigator.geolocation.getCurrentPosition(ST.Geolocation.onSuccessNetwork, ST.Geolocation.onErrorNetwork, { enableHighAccuracy: false, maximumAge: 0 });
};

ST.Geolocation.onSuccess = function (position) {

    if (position.coords.accuracy >= ST.Geolocation.minAccuracy) {
        //udało się uzyskać dostęp do GPS ale pozycja jest niedokładna
        //uzyskanie dokładnego fixu może trwać nawet do 2 minut,
        //przy czym i tak warto próbować, bo GPS jest prawie zawsze dokładniejszy niż sieć
        //dodatkowo na windows phone ten callback obsługuje też pobieranie pozycji z sieci i nie ma opcji, żeby to wykryć z kodu
    } else {
        //aktualizacja pozycji
        ST.Geolocation.latitude = position.coords.latitude;
        ST.Geolocation.longitude = position.coords.longitude;
        ST.Geolocation.accuracy = position.coords.accuracy;
        ST.Geolocation.minAccuracy = ST.Geolocation.accuracy;
        ST.Navigation.gpsAccurate();
        //ustaliliśmy pozycję, dalsze próby obniżą accuracy ale zajeżdzają baterię, więc stop
        ST.Geolocation.stopTracking();
    }
};

ST.Geolocation.onError = function (error) {
    var message;
    // Obsługa błędów
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //jeśli użytkownik w ustawieniach telefonu zmienił na nieudostępnienie żadnej lokalizacji
            //na WP 7.1 Ustawienia -> lokalizacja -> włącz/wyłącz
            message = "Włącz udostępnianie lokalizacji";
            alert(message);
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Wystąpił błąd z GPS";
            alert(message);
            break;
        case error.TIMEOUT:
            //znaczy to najprawdopodobniej, że GPS nie został włączony (android) przy czym Windows Phone robi co chce, najczęściej bierze sam pozycję po sieci, więc może ten błąd nie wystąpić
            ST.Geolocation.stopTracking();
            ST.Geolocation.getPositionFromNetwork();
            break;
    }
};

ST.Geolocation.onErrorNetwork = function (error) {
    var message;
    // Obsługa błędów
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //jeśli użytkownik w ustawieniach telefonu zmienił na nieudostępnienie żadnej lokalizacji
            //na WP 7.1 Ustawienia -> lokalizacja -> włącz/wyłącz
            message = "Włącz udostępnianie lokalizacji";
            alert(message);
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Wystąpił błąd z GPS";
            alert(message);
            break;
        case error.TIMEOUT:
            //znaczy to najprawdopodobniej, że GPS nie został włączony (android) przy czym Windows Phone robi co chce, najczęściej bierze sam pozycję po sieci, więc może ten błąd nie wystąpić
            message = "Wystąpił błąd z GPS";
            alert(message);
            break;
    }
};

ST.Geolocation.onSuccessNetwork = function (position) {

    if (position.coords.accuracy >= ST.Geolocation.minNetworkAccuracy) {
        //nie udało się, więc pozycja ręcznie
        ST.Report.positionInaccurate();
    } else {
        //aktualizacja pozycji
        ST.Geolocation.latitude = position.coords.latitude;
        ST.Geolocation.longitude = position.coords.longitude;
        ST.Geolocation.accuracy = position.coords.accuracy;
        ST.Geolocation.minAccuracy = ST.Geolocation.accuracy;
        ST.Navigation.gpsAccurate();
    }
};

ST.Geolocation.stopTracking = function () {
    navigator.geolocation.clearWatch(ST.Geolocation.watchID);
}