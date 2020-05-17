var mysql = require('mysql');
var fs = require('fs');
var config = require('../config.js');
var requestify = require('requestify');
var Clipper = require('image-clipper');

var scope;

var Annotator = function() {
  this.current_job_id = 0;
  scope = this;
};

Annotator.prototype.start = function() {
  scope.show_next_data();
}

Annotator.prototype.next = function() {
    flag = scope.submit();
    if (flag) {
        scope.current_job_id += 1;
        if (scope.current_job_id < config.num_questions) {
          scope.show_next_data();
          document.getElementById('progress_text').innerHTML = '<strong>Current Progress: '+scope.current_job_id+'/'+config.num_questions+'</strong>';
          document.getElementById('struct_score').value = 'NONE';
          document.getElementById('geo_score').value = 'NONE';
          document.getElementById('all_score').value = 'NONE';
        } else {
            alert('Thank you very much for the help! You can close the window and quit! Goodbye!');
        }
    } else {
          alert('Please answer all the THREE questions! Thank you!');
    }
};

Annotator.prototype.show_next_data = function() {
  console.log('Load next model');

  function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
  }
  this.result_list = ['algA', 'algB', 'algC'];
  shuffle(this.result_list);
  console.log('order: ', this.result_list)

  scope.load_results('resA_figures', this.result_list[0], config.num_figs_to_show);
  scope.load_results('resB_figures', this.result_list[1], config.num_figs_to_show);
  scope.load_results('resC_figures', this.result_list[2], config.num_figs_to_show);
};


Annotator.prototype.submit = function() {
  var struct_score = document.getElementById('struct_score').value;
  var geo_score = document.getElementById('geo_score').value;
  var all_score = document.getElementById('all_score').value;
  console.log(struct_score, geo_score, all_score)

  if (all_score === 'NONE' || geo_score === 'NONE' || struct_score === 'NONE') {
      return false;
  }

  var dict_struct = {}, dict_geo = {}, dict_all = {};
  dict_struct[this.result_list[parseInt(struct_score.charAt(0))]] = 2;
  dict_struct[this.result_list[parseInt(struct_score.charAt(1))]] = 1;
  dict_struct[this.result_list[parseInt(struct_score.charAt(2))]] = 0;
  struct_out = ''+dict_struct['algA']+dict_struct['algB']+dict_struct['algC'];
  
  dict_geo[this.result_list[parseInt(geo_score.charAt(0))]] = 2;
  dict_geo[this.result_list[parseInt(geo_score.charAt(1))]] = 1;
  dict_geo[this.result_list[parseInt(geo_score.charAt(2))]] = 0;
  geo_out = ''+dict_geo['algA']+dict_geo['algB']+dict_geo['algC'];
  
  dict_all[this.result_list[parseInt(all_score.charAt(0))]] = 2;
  dict_all[this.result_list[parseInt(all_score.charAt(1))]] = 1;
  dict_all[this.result_list[parseInt(all_score.charAt(2))]] = 0;
  all_out = ''+dict_all['algA']+dict_all['algB']+dict_all['algC'];

  query_url = config.host+':'+config.port+'/submit_answer/'+struct_out+'/'+geo_out+'/'+all_out;
  
  requestify.get(query_url)
    .then(function(response) {
    }
  ).fail(function(response) {
          alert('System error! Please stop annotating!');
          scope.modelId = undefined;
	});
  return true;
};

Annotator.prototype.load_results = function(sid, name, to_show) {
  if (to_show === config.num_figs_to_show) {
      document.getElementById(sid).innerHTML = "";
  };
  
    var image_id = Math.floor(Math.random() * config.tot_num_figs);

    var file_path = config.host+':'+config.port+'/get_img/'+
        name+'/'+image_id;
    var xmlhttp = new XMLHttpRequest();
    scope = this;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var outputImg = document.createElement('img');
            outputImg.height = '200';
            var urlCreator = window.URL || window.webkitURL;
            outputImg.src = urlCreator.createObjectURL(this.response);
            document.getElementById(sid).appendChild(outputImg);
            if (to_show > 1) {
                scope.load_results(sid, name, to_show-1);
            }
        }
    };
    xmlhttp.responseType = "blob";
    xmlhttp.open("GET", file_path, true);
    xmlhttp.send();
};

window.Annotator = Annotator;

