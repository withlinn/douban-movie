module.exports = (function () {
  var Tab = function (ctx) {
    this.ctx = ctx
    this.init();
    this.bind();
  }

  // 初始化变量
  Tab.prototype.init = function () {
    this.menuList = this.ctx.querySelectorAll('footer>div')
    this.pageList = this.ctx.querySelectorAll('main>section')
  }
  // 绑定时间
  Tab.prototype.bind = function () {
    var _this = this;
    this.menuList = [].slice.call(this.menuList)
    this.menuList.forEach((menu, i) => {
      menu.onclick = function () {
        document.querySelector('main').scrollTop = 0;
        _this.menuList.forEach((menu, i) => {
          menu.classList.remove('active');
          _this.pageList[i].classList.remove('active')
        })
        this.classList.add('active')
        _this.pageList[i].classList.add('active')
      }
    });
  }
  return Tab
})();