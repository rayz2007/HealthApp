'use strict'

let total = 0;
let totalCalories = 0;

fetchExercise($('#exerciseInput').attr('placeholder'));
$('#calculate').attr('disabled', true);
$('#exerciseInput').keyup(function() {
    if ($(this).val().length != 0) {
        $('#calculate').attr('disabled', false);
    } else {
        $('#calculate').attr('disabled', true);
    }
});

$('#calculate').click(function(event) {
    event.preventDefault();
    let input = $('#exerciseInput').val();
    fetchExercise(input);
});

$('#add').click(function(event) {
    $('#totalCals').empty();
    total += totalCalories;
    $('#totalCals').append(total);
})

function fetchExercise(searchTerm) {
    let url = 'https://trackapi.nutritionix.com/v2/natural/exercise';
    return fetch(url, {
        method: 'post',
        headers: {
            'x-app-id': 'bfbe68de',
            'x-app-key': '956c67f76ec3a67a0db5f5ab7f998b33',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'query': searchTerm,
            'gender': 'female',
            'weight_kg': 72.5,
            'height_cm': 167.64,
            'age': 30
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(renderExerciseTable)
    .catch(function(error) {
        console.error(error);
    });   
}

function renderExerciseTable(searchResults) {
    $('#tableBody').empty();
    let results = searchResults.exercises;
    totalCalories = 0;
    _.forEach(results, function(element) {
        let name = element.name;
        let duration = element.duration_min;
        let calories = element.nf_calories;
        totalCalories += calories;
        let newRow = $('<tr> </tr>');
        let exName = $('<td>' + name + '</td>');
        let durateLabel = $('<td>' + duration + '</td>');
        let calorieLabel = $('<td>' + calories + '</td>');
        newRow.append(exName);
        newRow.append(durateLabel);
        newRow.append(calorieLabel);
        $('#tableBody').append(newRow);
    });
}
