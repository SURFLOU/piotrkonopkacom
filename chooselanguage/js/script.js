$('#submit').click(function() {

  $('html, body').animate({
    scrollTop: $('#results').offset().top
  }, 1000);
  
  let languages = $('input[name="languages"]:checked').map(function() {
    return $(this).val().charAt(0).toUpperCase() + $(this).val().slice(1);
  }).get();

  var wages = new Array(6).fill(1);

  var factorOrder = Array.from(document.querySelectorAll('.factor')).map(function(factor) {
    return parseInt(factor.dataset.id);
  });

  var factorValues = [6, 5, 4, 3, 2, 1];

  factorOrder.forEach(function(factorId, index) {
    var wageIndex = factorId - 1;
    wages[wageIndex] = factorValues[index];
  });

  var languageList = languages.map(function(language) {
    return "language_list=" + encodeURIComponent(language);
  }).join('&');

  var phonemesList = languages.map(function(language) {
    return "known_phonemes=" + encodeURIComponent(language);
  }).join('&');

  var wagesList = wages.map(function(wage) {
    return "wages=" + wage;
  }).join('&');

  var url = "http://localhost:8000/recommend?" + languageList + "&" + wagesList;

  $.get(url, function(data, status) {
    if (status === 'success') {
      $('#result').html('Best langauge to learn for you is: ' + data.best_language + ' ' + data.total_score);

      // Run requests for the other functions using the best_language value
      $.get("http://localhost:8000/numberofhours/" + data.best_language, function(hoursData, hoursStatus) {
        if (hoursStatus === 'success') {
          $('#hours').html('Hours needed to learn the language: ' + hoursData.hours_needed);
        } else {
          $('#hours').html('An error occurred while processing your request.');
        }
      });


      $.get("http://localhost:8000/family_type/" + data.best_language, function(familyData, familyStatus) {
        if (familyStatus === 'success') {
          $('#family').html('Family of the language: ' + familyData.Type_of_family);
        } else {
          $('#family').html('An error occurred while processing your request.');
        }
      });

      $.get("http://localhost:8000/joboffersnumber/" + data.best_language, function(offersData, offersStatus) {
        if (offersStatus === 'success') {
          $('#offers').html('Number of job offers on pracuj.pl: ' + offersData.Number_of_job_offers);
        } else {
          $('#offers').html('An error occurred while processing your request.');
        }
      });

            $.get("http://localhost:8000/different_phonemes?" + phonemesList + "&unknown_phonemes=" + data.best_language, function(phonemesData, phonemesStatus) {
              if (phonemesStatus === 'success') {
                var unknownPhonemes = phonemesData.different_phonemes.join(', ');
                $('#phonemes').html('Unknown phonemes for ' + data.best_language + ': ' + unknownPhonemes);
              } else {
                $('#phonemes').html('An error occurred while processing your request.');
              }
            });
      

    } else {
      $('#result').html('An error occurred while processing your request.');
    }


    
$.get("http://localhost:8000/lexicalsimilarity?" + languageList, function(data, status) {
  if (status === 'success') {
    var similarities = '';
    var sortedData = Object.keys(data).sort(function(a, b) {
      return data[b].lexical_similarity_score - data[a].lexical_similarity_score;
    });
    for (var i = 0; i < sortedData.length; i++) {
      var language = sortedData[i];
      similarities += language + ' is similar to: ' + data[language].most_similar_language +' in ' + ' (' + data[language].lexical_similarity_score + ')<br>';
    }
    $('#similarities').html(similarities);
  } else {
    $('#similarities').html('An error occurred while processing your request.');
  }



});



  });

});