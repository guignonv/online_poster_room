/**
 * JOBIM Poster Virtual Room.
 * v1.3.0
 * Author: Valentin Guignon
 * Date: 06/07/2020
 * Copyright (C) The Alliance Bioversity - CIAT
 *
 * Requires jQuery >= 1.7
 *
 * Usage:
 *   Include CSS and JS.
 *
 *   In HTML body:
 *    <div id="jobim_poster_browser">&nbsp;</div>
 *    <script type="text/javascript">// <![CDATA[
 *      var jobim = {poster_show: true, lang: 'en'};
 *      $.getJSON("poster_room.json", function(json_data) {
 *        jobim = json_data;
 *      });
 *      $(function () {
 *        jobim_init_poster_room();
 *      });
 *    // ]]></script>
 *
 *   nb.: other values can be customized in var jobim. See code for details.
 */

/**
 * Tells if a variable is set.
 */
function jisset(obj) {
  if ((typeof obj === 'object') && (obj !== null)) {
    return (0 < Object.keys(obj).length);
  }
  else if (Array.isArray(obj)) {
    return (0 < obj.length);
  }
  else {
    return ((null !== obj) && ('' !== obj));
  }
}

/**
 * Renders hash data.
 *
 * @param hash (hash)
 *   A hash which keys are treated as data values (for unicity).
 * @param container_class (string)
 *   CSS class name of the container element.
 * @param element_class (string)
 *   CSS class name used for each element.
 * @param label (string)
 *   Label for the list of elements.
 */
function jobim_render_hash(hash, container_class, element_class = null, label = null) {
  var values_array = [];
  for (var key in hash) {
    if (jisset(key)) {
      values_array.push(
        '<span'
        + (jisset(element_class) ? 'class="' + element_class + '"' : '')
        + '>'
        + key
        + '</span>'
      );
    }
  }
  return '<span class="' + container_class + '">'
    + (jisset(label) ? '<span class="jobim-label">' + label + '</span>: ' : '')
    + values_array.join(', ')
    + '</span>';
}

/**
 * Renders poster field.
 *
 * @param: value (string)
 *   Field value to render.
 * @param: element_class (string)
 *   CSS class name used for the element.
 * @param: label (string)
 *   Label field to render. Can be NULL or empty for no label.
 * @param container_class (string)
 *   CSS class name of the container element if a label is set.
 */
function jobim_render_field(value, element_class, label = null, container_class = null) {
  if (!jisset(value)) {
    return '';
  }
  var field_html =
    '<span class="' + element_class + '">'
    + value
    + '</span>';
    if (jisset(label)) {
      field_html =
        '<span class="' + container_class + '">\n'
        + '<span class="jobim-label">' + label + '</span>\n'
        + field_html
        + '\n</span>';
    }
  return field_html;
}

/**
 * Renders poster number.
 *
 * @param: number (string)
 *   Poster number.
 */
function jobim_render_number(number) {
  return jobim_render_field('#' + number, 'jobim-poster-number');
}

/**
 * Renders poster title.
 *
 * @param: title (string)
 *   Poster title.
 */
function jobim_render_title(title) {
  return jobim_render_field(title, 'jobim-poster-title');
}

/**
 * Renders a list of authors.
 *
 * @param: authors (hash)
 *   keys are author names.
 */
function jobim_render_authors(authors) {
  return jobim_render_hash(
    authors,
    'jobim-poster-authors',
    'jobim-poster-author'
  );
}

/**
 * Renders keywords.
 *
 * @param: keywords (hash)
 *   keys are keywords.
 */
function jobim_render_keywords(keywords) {
  return jobim_render_field(keywords, 'jobim-poster-keywords', jobim.labels['keywords'][jobim.lang]);
}

/**
 * Renders categories.
 *
 * @param: categories (hash)
 *   keys are categories.
 */
function jobim_render_categories(categories) {
  return jobim_render_hash(
    categories,
    'jobim-poster-categories',
    'jobim-poster-category',
    jobim.labels['categories'][jobim.lang]
  );
}

/**
 * Renders poster room.
 *
 * @param: room (string)
 *   a poster room identifier.
 */
function jobim_render_room(room) {
  if ((typeof jobim.meeting_room_base_url == 'undefined')
      || ('' == jobim.meeting_room_base_url)) {
    return '';
  }
  return '<span class="jobim-poster-room"><span class="jobim-label">'
    + jobim.labels['room'][jobim.lang]
    + ':</span> <a href="'
    + jobim.meeting_room_base_url
    + room
    + '" target="_blank">'
    + room
    + '</a></span>\n'
  ;
}

/**
 * Renders poster PDF link.
 *
 * @param: pdf (string)
 *   a poster pdf file name.
 */
function jobim_render_pdf(pdf) {
  if ((typeof jobim.poster_base_url == 'undefined')
      || ('' == jobim.poster_base_url)) {
    return '';
  }
  return '<span class="jobim-poster-pdf">'
    + '<a href="'
    + jobim.poster_base_url
    + pdf
    + '" target="_blank">'
    + jobim.labels['pdf'][jobim.lang]
    + '</a></span>\n'
  ;
}

/**
 * Renders poster thumbnail.
 *
 * @param: thumbnail (string)
 *   a poster thumbnail image file name.
 */
function jobim_render_thumbnail(thumbnail) {
  if ((typeof jobim.thumbnail_base_url == 'undefined')
      || ('' == jobim.thumbnail_base_url)) {
    return '';
  }
  var html_block = '';
  if (jisset(thumbnail)) {
    html_block = '<span class="jobim-poster-thumbnail">'
      + '<img alt="Poster preview" src="'
      + jobim.thumbnail_base_url
      + thumbnail
      + '"/>'
      + '</span>\n'
    ;
  }
  else {
    html_block = '<span class="jobim-no-thumbnail">No poster preview available</span>\n';
  }
  return html_block;
}

/**
 * Renders a poster object as HTML.
 *
 * @param poster (object)
 *   a poster hash from jobim.posters array.
 *
 * @param index (int)
 *   The index of the poster in the displayed array. Can be null.
 */
function jobim_render_poster(poster, index = null) {
  var poster_html =
    '<div class="jobim-poster">\n  '
    + jobim_render_number(poster['number']) + '&nbsp;'
    + jobim_render_title(poster['title']) + '<br/>\n  '
    + jobim_render_authors(poster['authors']) + '<br/>\n  '
    + (jisset(poster['categories'])
      ? jobim_render_categories(poster['categories']) + '<br/>\n  '
      : '')
    + (jisset(poster['keywords'])
      ? jobim_render_keywords(poster['keywords']) + '<br/><br/>\n  '
      : '')
    + jobim_render_thumbnail(poster['thumbnail']) + '<br/>\n  '
    + (jisset(poster['room'])
      ? jobim_render_room(poster['room']) + '\n  '
      : '')
    + (jisset(poster['poster'])
      ? jobim_render_pdf(poster['poster']) + '\n'
      : '')
    + '</div>';
  return poster_html;
}

/**
 * Update Poster Gallery display.
 */
function jobim_update_gallery() {
  // Clear gallery.
  $('#jobim_poster_gallery').empty();
  var displayed_poster_count = 0;
  var poster_count = 0;
  // Update poster display status.
  jobim.posters.forEach(function (poster) {
    if (poster['init_display']) {
     ++poster_count;
    }
    poster['display'] = false;
    var category_match = (
      ((0 < $('#jobim_categories_filter input:checked').length)
        && (0 < $('#jobim_categories_filter input:not(:checked)').length))
      ? false
      : true
    );
    // Categories.
    for (key in poster['categories']) {
      if (jobim.filters['categories'][key]) {
        category_match = true;
      }
    }
    // Authors.
    var author_match = (('' != $('#jobim_authors_select').val()) ? false : true);
    if (!author_match) {
      for (key in poster['authors']) {
        if (jobim.filters['authors'][key]) {
          author_match = true;
        }
      }
    }
    // Final display status.
    if (category_match
        && author_match
        && poster['match_title']
        && poster['match_keywords']
        && poster['match_number']
    ) {
      poster['display'] = poster['init_display'];
      // poster['display'] = (
      //   jisset(poster['title']) && jisset(poster['poster'])
      //   ? poster['init_display']
      //   : false
      // );
      if (poster['display']) {
        ++displayed_poster_count;
      }
    }

  });
  // Update HTML.
  $('#jobim_poster_count').html(
    jobim.labels['posters_count'][jobim.lang]
    + ' '
    + displayed_poster_count
    + ' '
    + jobim.labels['over'][jobim.lang]
    + ' '
    + poster_count
    + ' '
    + jobim.labels['posters'][jobim.lang]
  );
  jobim.posters.forEach(function (poster) {
    if (poster['display']) {
      $('#jobim_poster_gallery').append(jobim_render_poster(poster));
    }
  });
}

/**
 * Initialize filters possible values.
 */
function jobim_init_filters() {
  var key;
  jobim.filter_list.forEach(function (filter_name) {
    jobim.filters[filter_name] = {};
  });
  jobim.posters.forEach(function (poster, index) {
    // Save initial display status.
    jobim.posters[index]['init_display'] = poster['display'];
    jobim.match_list.forEach(function (match_name) {
      poster['match_' + match_name] = true;
    });
    jobim.filter_list.forEach(function (filter_name) {
      for (key in poster[filter_name]) {
        if (jisset(key)) {
          jobim.filters[filter_name][key] = true;
        }
      }
    });
  });
}

/**
 * Render filter dropdown.
 */
function jobim_render_filter_dropdown(filter_name, filter_label) {
  // Label.
  var $filter = $(
    '<div id="jobim_'
    + filter_name
    + '_filter" class="jobim-filter"><span class="jobim-label">'
    + jobim.labels[filter_label][jobim.lang]
    + ':</span>&nbsp;</div>'
  );
  // Dropdown and its behavior.
  $('<select name="' + filter_name + '" id="jobim_' + filter_name + '_select">\n</select>')
    .appendTo($filter)
    .append('<option value="" selected="selected">-</option>\n')
    .on('change', function () {
      // An element has been selected.
      if ('' != $(this).val()) {
        for (key in jobim.filters[filter_name]) {
          if ($(this).val() == key) {
            // Selected element.
            jobim.filters[filter_name][key] = true;
          }
          else {
            // Other unselected element.
            jobim.filters[filter_name][key] = false;
          }
        }
      }
      else {
        // No element selected, disable filter (all elements "on").
        for (key in jobim.filters[filter_name]) {
          jobim.filters[filter_name][key] = true;
        }
      }
      jobim_update_gallery();
    })
  ;
  // Now add elements to the dropdown list.
  var elements = [];
  for (key in jobim.filters[filter_name]) {
    elements.push(key);
  }
  // Sort elements.
  elements = elements.sort(Intl.Collator().compare);
  // Add options.
  elements.forEach(function (element) {
    $filter.find('#jobim_' + filter_name + '_select')
      .append('<option value="' + element + '">' + element + '</option>\n')
    ;
  });

  return $filter;
}

/**
 * Render filter checkboxes.
 */
function jobim_render_filter_checkboxes(filter_name, filter_label) {
  // Filter container.
  var $filter = $(
    '<div id="jobim_'
    + filter_name
    + '_filter" class="jobim-filter"><input type="checkbox" id="jobim_'
    + filter_name
    + '_filter_master_checkbox" value="" checked="checked" class="jobim-master-checkbox"/><label class="jobim-label" for="jobim_'
    + filter_name
    + '_filter_master_checkbox">'
    + jobim.labels[filter_label][jobim.lang]
    + ':</label><br/><div class="jobim-checkbox-group"></div></div>'
  );
  // Master checkbox behavior.
  $filter.find('> input.jobim-master-checkbox')
    .on('click', function () {
      $filter.find('input.jobim-' + filter_name).prop('checked', this.checked);
      for (key in jobim.filters[filter_name]) {
        jobim.filters[filter_name][key] = this.checked;
      }
      jobim_update_gallery();
    })
  ;
  var $checkbox_group = $filter.find('div.jobim-checkbox-group');
  // Filtering values.
  for (key in jobim.filters[filter_name]) {
    var $checkbox_element = $('<div class="jobim-checkbox"></div>');
    var checkbox_id = 'jobim_' + filter_name + '_' + key.replace(/\W+/g, '_');
    $(
      '<input id="'
      + checkbox_id
      + '" type="checkbox" value="'
      + key
      + '"'
      + (jobim.filters[filter_name][key]
          ? ' class="jobim-' + filter_name + '" checked="checked"'
          : ''
        )
      + '/>'
    )
      .appendTo($checkbox_element)
      .on('change', function() {
        jobim.filters[filter_name][$(this).val()]= $(this).prop('checked');
        jobim_update_gallery();
      })
    ;
    var label = key;
    if (key in jobim.labels) {
      label = jobim.labels[key][jobim.lang];
    }
    $checkbox_element
      .append('&nbsp;<label for="' + checkbox_id + '">' + label + '</label>');
    $checkbox_group
      .append($checkbox_element);
  }

  $filter.append('<br style="clear: both;"/>');

  return $filter;
}

/**
 * Render filter text.
 */
function jobim_render_filter_text(filter_name, filter_label) {
  // Filter container.
  var $filter = $(
    '<div id="jobim_'
    + filter_name
    + '_filter" class="jobim-filter"><label class="jobim-label" for="jobim_'
    + filter_name
    + '_filter_text">'
    + jobim.labels[filter_label][jobim.lang]
    + ':</label>&nbsp;<input type="text" id="jobim_'
    + filter_name
    + '_filter_text" value="" class="jobim-filter-'
    + filter_name
    + '-text"/><br/></div>'
  );
  // Text filtering behavior.
  $filter.find('#jobim_'
    + filter_name
    + '_filter_text')
    .on('input', function () {
      if (jisset($(this).val())) {
        var search_text = $(this).val().toLocaleLowerCase();
        // Update posters' matching status.
        jobim.posters.forEach(function (poster) {
          var poster_display = false;
          if (0 <= (''+poster[filter_name]).toLocaleLowerCase().indexOf(search_text)) {
            poster_display = true;
          }
          poster['match_' + filter_name] = poster_display;
        });
      }
      else {
        // No text, show all.
        jobim.posters.forEach(function (poster) {
          poster['match_' + filter_name] = true;
        });
      }
      jobim_update_gallery();
    })
  ;

  return $filter;
}

/**
 * Render filter bar.
 */
function jobim_render_filters() {
  var key;
  $('#jobim_poster_browser').prepend('<div id="jobim_poster_filters"></div>');

  // Categories filter.
  $('#jobim_poster_filters').append( jobim_render_filter_checkboxes('categories', 'categories') );
  $('#jobim_poster_filters').append( '<br/>' );

  // Title filter.
  $('#jobim_poster_filters').append( jobim_render_filter_text('title', 'title_filter') );
  $('#jobim_poster_filters').append( '<br/>' );

  // Keywords filter.
  $('#jobim_poster_filters').append( jobim_render_filter_text('keywords', 'keywords_filter') );
  $('#jobim_poster_filters').append( '<br/>' );

  // Authors filter.
  $('#jobim_poster_filters').append( jobim_render_filter_dropdown('authors', 'authors') );
  $('#jobim_poster_filters').append( '<br/>' );

  // Number filter.
  $('#jobim_poster_filters').append( jobim_render_filter_text('number', 'number_filter') );
  $('#jobim_poster_filters').append( '<br/>' );

}

/******************************************************************************/

// Initialize the whole broswer.
function jobim_init_poster_room(jobim) {

  // Declare jobim variable if not declared and init what's needed.
  if (typeof jobim == 'undefined') {
    jobim = {};
  }

  if (typeof jobim.poster_show == 'undefined') {
    jobim.poster_show = 0;
  }

  // Poster data.
  if (typeof jobim.posters == 'undefined') {
    jobim.posters = [];
  }

  if (typeof jobim.lang == 'undefined') {
    if ((typeof lang == 'undefined') || ('fr' == lang)) {
      jobim.lang = 'fr';
    }
    else {
      jobim.lang = 'en';
    }
  }

  if (typeof jobim.labels == 'undefined') {
    jobim.labels = {
      closed: {
        en: 'The virtual poster room is currently closed. Please come back later, thanks for your visit.',
        fr: 'La salle virtuelle des posters est actuellement fermée. Veuillez repasser plus tard, merci pour votre visite.'
      },
      authors: {
        en: 'Authors',
        fr: 'Auteurs'
      },
      institutes: {
        en: 'Institutes',
        fr: 'Instituts'
      },
      keywords: {
        en: 'Keywords',
        fr: 'Mots clés'
      },
      categories: {
        en: 'Categories',
        fr: 'Categories'
      },
      room: {
        en: 'Room',
        fr: 'Salle'
      },
      pdf: {
        en: 'Download PDF',
        fr: 'Télécharger le PDF'
      },
      title_filter: {
        en: 'Title contains',
        fr: 'Le titre contient'
      },
      keywords_filter: {
        en: 'Containing keywords',
        fr: 'Contenant les mots clés'
      },
      number_filter: {
        en: 'Poster number',
        fr: 'Numéro du poster'
      },
      posters_count: {
        en: 'Displaying',
        fr: 'Selection de '
      },
      over: {
        en: 'over',
        fr: 'sur'
      },
      posters: {
        en: 'posters',
        fr: 'posters'
      },
      NGS: {
        en: "Algo/NGS",
        fr: "Algo/NGS"
      },
      service: {
        en: "Database &amp; Service",
        fr: "Base de données &amp; service"
      },
      evolution: {
        en: "Evolution, phylogenetics and population genetics",
        fr: "Évolution, phylogénétique et génétique des populations"
      },
      'functional genomics': {
        en: "Functional genomics",
        fr: "Génomique fonctionnelle"
      },
      metabolomics: {
        en: "Metabolomics",
        fr: "Métabolomique"
      },
      metagenomics: {
        en: "Metagenomics",
        fr: "Métagénomique"
      },
      FAIR: {
        en: "Reproductibility, open science, workflows, FAIR",
        fr: "Reproductibilité, open science, workflows, FAIR"
      },
      stat: {
        en: "Statistics, Machine Learning and AI",
        fr: "Statistiques, Machine Learning et I.A."
      },
      structure: {
        en: "Structural bioinformatics &amp; Protein annotations",
        fr: "Bioinformatique Structurelle &amp; Annotation des Protéines"
      },
      system: {
        en: "Systems Biology",
        fr: "Biologie des systèmes"
      },
      medicine: {
        en: "Variant calling &amp; Medicine",
        fr: "Variant calling &amp; Médecine"
      },
      visualization: {
        en: "Visualization",
        fr: "Visualisation"
      }
    };
  }

  if (typeof jobim.meeting_room_base_url == 'undefined') {
    jobim.meeting_room_base_url = '';
  }

  if (typeof jobim.poster_base_url == 'undefined') {
    jobim.poster_base_url = '';
  }

  if (typeof jobim.thumbnail_base_url == 'undefined') {
    jobim.thumbnail_base_url = '';
  }

  // Filters data.
  if (typeof jobim.filter_list == 'undefined') {
    jobim.filter_list = ['categories', 'authors'];
  }
  if (typeof jobim.match_list == 'undefined') {
    jobim.match_list = ['title', 'keywords', 'number'];
  }
  if (typeof jobim.filters == 'undefined') {
    jobim.filters = {};
  }

  var url_params = new URLSearchParams(window.location.search);
  var poster_bypass = url_params.get('poster_bypass');
  // Merci à ceux qui utilisent 'poster_bypass' de le garder pour eux. ;-)
  if (jobim.poster_show || poster_bypass) {
    jobim_init_filters();
    jobim_render_filters();
    $('#jobim_poster_browser')
      .append('<div id="jobim_poster_count"></div>')
      .append('<div id="jobim_poster_gallery"></div>');
    jobim_update_gallery();
  }
  else {
    $('#jobim_poster_browser')
      .append('<div>' + jobim.labels['closed'][jobim.lang] + '</div>');
  }
}
