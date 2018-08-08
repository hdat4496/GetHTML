function Song(date, title, artist, position) {
    this.date = date;
    this.title = title;
    this.artist = artist;
    this.position = position;
}
var songs = [];
var check_done = 0;
//Test
// $.ajaxPrefilter( function (options) {
//     if (options.crossDomain && jQuery.support.cors) {
//         var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
//         options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
//         //options.url = "http://cors.corsproxy.io/url=" + options.url;
//     }
// });
// $.get('http://www.officialcharts.com/charts/r-and-b-singles-chart/20100704/114/',function (response) {
//     var json = $.parseHTML(response);
//     // console.log(json);
//     var n=0;
//     json.forEach(function(element) {
//         if (element.id=="container") {
//             var a=element.childNodes[7].childNodes[9].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes;
//             // console.log(a);
//             a.forEach(function (elemen1) {
//
//                 if(elemen1.childNodes.length > 0 && elemen1.className =="" && elemen1.childNodes[1].childNodes[1]){
//                     // console.log(elemen1);
//                     var posotion = elemen1.childNodes[1].childNodes[1].textContent; //posotion
//                     if (isNaN(parseInt(posotion))) {
//                         return;
//                     }
//                     var title = elemen1.childNodes[5].childNodes[1].childNodes[3].childNodes[1].childNodes[1].textContent;//title
//                     var artist = elemen1.childNodes[5].childNodes[1].childNodes[3].childNodes[3].childNodes[1].textContent;//artist
//                     var song =  new Song;
//                     song.title = title;
//                     song.position=posotion;
//                     song.artist=artist;
//                     songs.push(song);
//
//                 }
//
//             });
//             check_done +=1;
//             if (check_done == 1) {
//                 var result = CSV(songs);
//                 exportFile(result, "DataInput.csv");
//                 console.log("----------DONE------------");
//             }
//
//
//
//         }
//     })
//
// });
function getData(urls) {
    $.ajaxPrefilter( function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
            //options.url = "http://cors.corsproxy.io/url=" + options.url;
        }
    });
    // Nhaccuatui.com
    // $.get(url,function (response) {
    //         var json = $.parseHTML(response);
    //         json.forEach(function(element) {
    //             if (element.className=="box-content")
    //             {
    //                 var a=element.childNodes[3].childNodes[1].childNodes[1].childNodes[11].childNodes[3].childNodes[1].childNodes;
    //                 // console.log(a);
    //                 a.forEach(function (elemen1) {
    //                     if(elemen1.childNodes.length > 0){
    //                         var posotion = elemen1.childNodes[1].textContent; // Postion
    //                         var title = elemen1.childNodes[5].childNodes[3].childNodes[0].textContent;//title
    //                         // console.log(elemen1.childNodes[5].childNodes[5].childNodes)
    //                         var b = elemen1.childNodes[5].childNodes[5].childNodes;
    //                         var artist = '';
    //                         b.forEach(function (element2) {
    //                             if(element2.textContent == ', ')
    //                                 artist += ' OR ';
    //                             else
    //                                 artist += element2.textContent;
    //
    //                         });
    //                         var song =  new Song;
    //                         song.title = title;
    //                         song.position=posotion;
    //                         song.artist=artist;
    //                         songs.push(song);
    //
    //                     }
    //
    //                 });
    //                 check_done +=1;
    //                 if (check_done == 2) {
    //                     var result = CSV(songs);
    //                     exportFile(result, "DataInput.csv");
    //                     console.log("----------DONE------------");
    //                 }
    //
    //
    //
    //             }})
    //
    //     });



    //officialcharts.com
    $.get(urls,function (response) {
        var json = $.parseHTML(response);
        var n=0;
        var day = urls.url.substr(-7,2);
        var month = urls.url.substr(-9,2);
        var year = urls.url.substr(-13,4);
        var date = day +"/"+month+"/"+year;
        json.forEach(function(element) {
            if (element.id=="container") {
                var a=element.childNodes[7].childNodes[9].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes;
                a.forEach(function (elemen1) {

                    if(elemen1.childNodes.length > 0 && elemen1.className =="" && elemen1.childNodes[1].childNodes[1]){
                        var posotion = elemen1.childNodes[1].childNodes[1].textContent; //posotion
                        if (isNaN(parseInt(posotion))) {
                            return;
                        }
                        var title = elemen1.childNodes[5].childNodes[1].childNodes[3].childNodes[1].childNodes[1].textContent;//title
                        var artist = elemen1.childNodes[5].childNodes[1].childNodes[3].childNodes[3].childNodes[1].textContent;//artist
                        var song =  new Song;
                        song.title = title;
                        song.position=posotion;
                        song.artist=artist;
                        song.date = date;
                        songs.push(song);

                    }

                });
                check_done +=1;
                if (check_done == 2) {
                    var result = CSV(songs);
                    exportFile(result, "DataInput.csv");
                    console.log("----------DONE------------");
                }



            }
        })

    });
}
var data = [];
var dataResult = [];
function handleFileSelect(evt) {
    var file = evt.target.files[0];
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            data = results.data;
            data.forEach(function (url) {
                getData(url);
            });
        }
    });
}
function CSV(songs) {
    var empConnects = [];
    songs.forEach(function (song) {
        empConnects.push([
            "\"" + song.date + "\"",
            "\"" + song.title + "\"",
            "\"" + song.artist + "\"",
            "\"" + song.position + "\"",
        ]);
    });
    if (empConnects.length < 1) {
        console.log("no data");
        return;
    }
    var csvContent = "data:text/csv;charset=utf-8,%EF%BB%BF";
    csvContent = "";
    empConnects.forEach(function (infoArray, index) {
        dataString = infoArray.join(",");
        csvContent += index < empConnects.length ? dataString : dataString;
        csvContent += "\n";
    });

    return csvContent;

}

function exportFile(data, filename) {

    if (!data) {
        console.error('Console.save: No data');
        return;
    }

    if (!filename) filename = 'console.json';

    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e)
}

$(document).ready(function () {
    $("#csv-file").change(handleFileSelect);
});


