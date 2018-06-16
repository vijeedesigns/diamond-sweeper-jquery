var game = {
	click_count : 0,
	total_count : 64,
	success_count : 0,
	points : 64,

	boxes : [],
	diamonds : [],
	diamonds_remain : [],

	boxes_html : '',

	game_over : false,

	create_diamonds : ()=> {
		while(this.game.diamonds.length<8) {
			var random_number = Math.floor(Math.random() * 63);
			if(this.game.diamonds.indexOf(random_number)==-1) {
				this.game.diamonds.push(random_number);
				this.game.diamonds_remain.push(random_number);
			}
		}
	},

	click_diamond_box : (boxid,event)=> {
		var box = {
			id : 0,
			is_diamond : false,
			success : false,
			clicked : false
		};
		this.game.boxes.map(item=> {
			if(item.id == boxid) {
				box = item;
			}
		})
		box.clicked = true;
		$(event.target).addClass('clicked');
		this.game.click_count++;
		$('#click_count').html(this.game.click_count);

		this.game.points--;
		if(box.is_diamond) {
			box.success = true;
			$(event.target).addClass('success');
			this.game.success_count++;
			$('#success_count').html(this.game.success_count);

			if(this.game.success_count==8) {
				this.game.save_log();
			}
		}
		else {
			box.success = false;
			$(event.target).removeClass('success');
		}

		var index = this.game.diamonds_remain.indexOf(box.id);
		if(index > -1) {
			this.game.diamonds_remain.splice(index, 1);
		}

		this.game.get_one_diamond();

		if(this.game.success_count<8 && this.game.click_count>=56) {
			this.game.game_over = true;
			$('.game-over-box').addClass('show');
		}

		$('.success-points').html(this.game.points+this.game.success_count);

		if(this.game.success_count==8) {
			$('#diamond-box-container').addClass('complete');
			$('.game-complete-box').addClass('show');
		}
	},

	one_diamond : null,
	get_one_diamond : ()=> {
		if(this.game.diamonds_remain.length>1) {
			this.game.one_diamond = this.game.diamonds_remain[Math.floor(Math.random() * this.game.diamonds_remain.length)];
		}
		else {
			this.game.one_diamond = this.game.diamonds_remain[0];
		}
		$('#diamond-box-'+this.game.one_diamond+' .diamond-arrow-left').addClass('show');
		setTimeout(()=> {
			this.game.one_diamond = null;
			$('.diamond-box .diamond-arrow-left').removeClass('show');
		},1000)
	},

	saved_logs : (localStorage.getItem('diamons_sweeper'))? JSON.parse(localStorage.getItem('diamons_sweeper')): [],
	saved_log_html : '',
	save_log : ()=> {
		this.game.saved_logs.push({
			time : new Date(),
			points : this.game.points+this.game.success_count
		});
		localStorage.setItem('diamons_sweeper',JSON.stringify(this.game.saved_logs));
	},
	set_log_html : ()=> {
		this.game.saved_log_html = '';
		for(i=0;i<this.game.saved_logs.length;i++) {
			var log = this.game.saved_logs[i];
			var logtime = new Date(log.time);
			var time = logtime.getFullYear()+'-'+logtime.getMonth()+'-'+logtime.getDate()+' '+logtime.getHours()+':'+logtime.getMinutes();
			this.game.saved_log_html += '<div class="log">'+
								            '<div class="datetime">'+time+'</div>'+
								            '<div class="points">'+log.points+'</div>'+
								        '</div>';
		}
		$('.prevoius-log').html(this.game.saved_log_html);
	},

	start_again : ()=> {
		this.game.click_count = 0;
		this.game.total_count = 64;
		this.game.success_count = 0;
		this.game.points = 64;

		this.game.boxes = [];
		this.game.diamonds = [];
		this.game.diamonds_remain = [];

		this.game.boxes_html = '';
		$('#diamond-box-container').html('');

		this.game.game_over = false;

		$('#diamond-box-container').removeClass('complete');
		$('.game-complete-box').removeClass('show');
		$('.game-over-box').removeClass('show');

		setTimeout(()=> {
			this.game.init();
		})
	},
	init : ()=> {
		this.game.create_diamonds();
		for(var i=0;i<64;i++) {
			var box = {
				id : i,
				is_diamond : this.game.diamonds.indexOf(i)>-1,
				success : false,
				clicked : false
			}
			this.game.boxes.push(box);

			this.game.boxes_html += '<div class="diamond-box" id="diamond-box-'+box.id+'" onclick="game.click_diamond_box('+box.id+',event)">'+
						                '<div class="index">'+box.id+'</div>'+
						                '<div class="bomb"><img src="assets/bomb.png"></div>'+
						                '<div class="diamond"><img src="assets/diamond.png"></div>'+
						                '<div class="diamond-arrow-left"><img src="assets/arrow-right.png" /></div>'+
						            '</div>';
		}

		this.game.set_log_html();

		$('#diamond-box-container').html(this.game.boxes_html);
	}
}

$(document).ready(function() {
	game.init();
});