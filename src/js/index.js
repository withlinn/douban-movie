import '../css/index.css'
// console.log('hello')
import $ from './jquery.min'
import Tab from './tab'
$(function () {
  // Tab组件初始化，传入上下文
  new Tab(document.querySelector('.page'))

  // Top250 tab
  var tabTop = {
    init: function (ctx) {
      this._data = {
          start: 0,
          count: 10 // 10个
        },
        this.$loading = ctx.find('.loading')
      this.$list = ctx.find('.top250-list')
      this.$top250 = ctx.find('.top250')
      this.isLoading = false;
      this.$main = ctx.find('main')
      // 请求数据
      this.getMovieData(this._data)
      this.bindEvent()
    },
    getMovieData: function (data) {
      this.$loading.show()
      this.isLoading = true;
      var _this = this;
      $.ajax({
        url: 'http://api.douban.com/v2/movie/top250',
        type: 'GET',
        data: data,
        dataType: 'jsonp',
      }).done(function (res) {
        _this.$loading.hide();
        var movies = res.subjects;
        _this.renderMovieList(movies)
        _this.isLoading = false;
        _this._data.start += _this._data.count;
        // console.log(movies)
      })
    },
    renderMovieList: function (movies) {
      var _this = this;
      // 数据获取完毕
      if (movies.length === 0) {
        var $p = $('<p class="no-more">没有更多了...</p>')
        this.$top250.append($p)
        return;
      }
      movies.forEach((movie) => {
        var $item = _this.createMovieNode(movie)
        var actorList = [];
        movie.casts.forEach(actor => {
          actorList.push(actor.name)
        })
        $item.find('.actor').text('主演: ' + actorList.join(' / '))
        var types = movie.genres.join(' / ')
        $item.find('.type').text(types)
        _this.$list.append($item)
      })
    },
    // 单个movie对象渲染成$对象返回
    createMovieNode: function (movie) {
      var template = `<li class="movie-item">
                        <a href="./detail.html?id=${movie.id}">
                          <div class="movie-photo">
                            <img src="${movie.images.small}" alt="">
                          </div>
                          <div class="movie-detail">
                            <h3 class="movie-title">${movie.title}</h3>
                            <p class="movie-collection">
                              <span class="rating">${movie.rating.average} 分</span>
                              <span>/</span>
                              <span>${movie.collect_count} 收藏 </span>
                            </p>
                            <p class="movie-type">
                              <span class="pubtime">${movie.year}</span>
                              <span class="type"></span>
                            </p>
                            <p class="director">导演：${movie.directors[0].name}</p>
                            <p class="actor"></p>
                          </div>
                        </a>
                      </li>`;
      return $(template)
    },
    bindEvent: function () {
      var _this = this;
      var timer = null;
      this.$main.scroll(function () {
        // console.log('----')
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          if (_this.isToBottom()) {
            _this.getMovieData(_this._data)
          }
        }, 300);
      })
    },
    isToBottom() {
      if (this.$main.height() + this.$main.scrollTop() + 30 >= this.$top250.height()) {
        return true;
      } else {
        return false;
      }
    }
  }

  // Search
  var tabSearch = {
    init: function ($ctx) {
      this.$input = $ctx.find('.search-input input')
      this.$searchBtn = $ctx.find('.search-btn')
      this.$searchList = $ctx.find('.search-list')
      this.$loading = $ctx.find('.search .loading')
      this.$loading.hide()
      this.bindEvent(); // 绑定事件
    },
    bindEvent: function () {
      var _this = this
      this.$searchBtn.click(function () {
        var keyword = _this.$input.val().trim()
        if (keyword) {

          _this.searchMovies(keyword)
        }
      })
      this.$input.on('keyup', function (e) {
        if (e.which === 13) // enter
        {
          _this.$searchBtn.trigger('click')
        }
      })
    },
    searchMovies: function (keyword) {
      var _this = this;
      this.$searchList.empty();
      this.$loading.show();
      $.ajax({
        url: 'http://api.douban.com/v2/movie/search',
        data: {
          q: keyword
        },
        dataType: 'jsonp'
      }).done(function (res) {
        _this.$loading.hide()
        var movies = res.subjects
        _this.renderSearchList(movies)
        console.log(movies)
      })
    },
    renderSearchList(movies) {
      var _this = this;

      var filterMovies = movies.filter(function (movie) {
        return movie.genres.length !== 0 && movie.directors.length !== 0
      })
      console.log(filterMovies)
      filterMovies.forEach(function (movie) {
        var $item = _this.createMovieNode(movie)
        var actorList = movie.casts.map(cast => cast.name)
        // console.log(actorList)
        $item.find('.actor').text('主演：' + actorList.join(' / '))
        $item.find('.type').text(movie.genres.join(' / '))
        _this.$searchList.append($item)
        // movie.casts.forEach(function())
      })
    },
    // 单个movie对象渲染成$对象返回
    createMovieNode: function (movie) {
      var template = `<li class="movie-item">
                        <a href="./detail.html?id=${movie.id}">
                          <div class="movie-photo">
                            <img src="${movie.images.small}" alt="">
                          </div>
                          <div class="movie-detail">
                            <h3 class="movie-title">${movie.title}</h3>
                            <p class="movie-collection">
                              <span class="rating">${movie.rating.average} 分</span>
                              <span>/</span>
                              <span>${movie.collect_count} 收藏 </span>
                            </p>
                            <p class="movie-type">
                              <span class="pubtime">${movie.year}</span>
                              <span class="type"></span>
                            </p>
                            <p class="director">导演：${movie.directors[0].name}</p>
                            <p class="actor"></p>
                          </div>
                        </a>
                      </li>`;
      return $(template)
    }
  }
  // tab us 
  var tabNew = {
    init: function (ctx) {
      this.$list = ctx.find('.us-movie-list')
      this.$loading = ctx.find('.us .loading')
      this.$loading.hide()
      this.getUsMovies();
    },
    getUsMovies() {
      var _this = this;
      this.$loading.show();
      $.ajax({
        url: 'http://api.douban.com/v2/movie/us_box',
        dataType: 'jsonp'
      }).done(function (res) {
        // 提取电影信息
        _this.$loading.hide();
        var movies = res.subjects.map(item => item.subject)
        console.log(movies)
        _this.renderUsMovieList(movies)

      })
    },
    renderUsMovieList(movies) {
      var _this = this;
      movies.forEach(function (movie) {
        var $item = _this.createMovieNode(movie);
        var actorList = movie.casts.map(cast => cast.name)
        $item.find('.actor').text('主演： ' + actorList.join(' / '))
        $item.find('.type').text(movie.genres.join(' / '))
        _this.$list.append($item)
      })
    },
    // 单个movie对象渲染成$对象返回
    createMovieNode: function (movie) {
      var template = `<li class="movie-item">
                        <a href="./detail.html?id=${movie.id}">
                          <div class="movie-photo">
                            <img src="${movie.images.small}" alt="">
                          </div>
                          <div class="movie-detail">
                            <h3 class="movie-title">${movie.title}</h3>
                            <p class="movie-collection">
                              <span class="rating">${movie.rating.average} 分</span>
                              <span>/</span>
                              <span>${movie.collect_count} 收藏 </span>
                            </p>
                            <p class="movie-type">
                              <span class="pubtime">${movie.year}</span>
                              <span class="type"></span>
                            </p>
                            <p class="director">导演：${movie.directors[0].name}</p>
                            <p class="actor"></p>
                          </div>
                        </a>
                      </li>`;
      return $(template)
    }
  }
  tabTop.init($('.page'))
  tabNew.init($('.page'))
  tabSearch.init($('.page'))
})