/* 东北农虾品牌站 · 公共脚本:导航/页脚注入 + 交互 */
(function () {
  'use strict'

  var PAGE = document.body.getAttribute('data-page') || ''

  var NAV_HTML =
    '<header class="nav" data-role="nav">' +
      '<div class="nav__inner container">' +
        '<a class="brand" href="index.html" aria-label="东北农虾首页">' +
          '<span class="brand__logo"><img src="assets/logo.png" alt="东北农虾 Logo"></span>' +
          '<span><span class="brand__name">东北<em>农虾</em></span>' +
          '<span class="brand__tag">寒地稻田 · 高校科技</span></span>' +
        '</a>' +
        '<nav class="nav__links" id="navLinks" aria-label="主导航">' +
          '<a href="index.html" data-nav-key="index">首页</a>' +
          '<a href="online.html" data-nav-key="online">线上销售</a>' +
          '<a href="supermarket.html" data-nav-key="supermarket">实体商超</a>' +
          '<a href="restaurant.html" data-nav-key="restaurant">餐饮供货</a>' +
          '<a href="product.html" data-nav-key="product">产品介绍</a>' +
          '<a href="cooperation.html" data-nav-key="cooperation">养殖合作</a>' +
          '<a href="service.html" data-nav-key="service">售后服务</a>' +
        '</nav>' +
        '<a class="btn btn--sun btn--sm nav__cta" href="cooperation.html">合作咨询</a>' +
        '<button class="nav__toggle" aria-expanded="false" aria-controls="navLinks" aria-label="展开菜单">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</header>'

  var FOOTER_HTML =
    '<footer class="footer" data-role="footer">' +
      '<div class="container">' +
        '<div class="footer__grid">' +
          '<div class="footer__brand">' +
            '<a class="brand" href="index.html">' +
              '<span class="brand__logo"><img src="assets/logo.png" alt="东北农虾 Logo"></span>' +
              '<span><span class="brand__name">东北<em>农虾</em></span>' +
              '<span class="brand__tag">寒地稻田 · 高校科技</span></span>' +
            '</a>' +
            '<p style="margin-top:16px">依托东北农业大学"寒地小龙虾抱仔苗小规格苗种培育技术",以线上电商、校园渠道与 B 端供货全域运营,打造高品质、高性价比的东北本土速食龙虾品牌。</p>' +
            '<div class="footer__slogan">冰泉养 · 鲜弹甜</div>' +
          '</div>' +
          '<div>' +
            '<h4>三大渠道</h4>' +
            '<ul class="footer__links">' +
              '<li><a href="online.html">线上销售 · 电商矩阵</a></li>' +
              '<li><a href="supermarket.html">实体商超 · 校园零售</a></li>' +
              '<li><a href="restaurant.html">餐饮供货 · B端供应</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>品牌速览</h4>' +
            '<ul class="footer__links">' +
              '<li><a href="product.html">产品介绍 · 三大系列</a></li>' +
              '<li><a href="cooperation.html">养殖合作 · 基地共建</a></li>' +
              '<li><a href="service.html">售后服务 · 品质承诺</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>联系我们</h4>' +
            '<ul class="footer__contact">' +
              '<li>项目团队:虾路相逢 · 东北农业大学</li>' +
              '<li>客服热线:400-XXX-XXXX <em style="font-style:normal;opacity:.6">(计划书定稿后替换)</em></li>' +
              '<li>官方公众号 / 小程序:东北农虾</li>' +
              '<li>商务合作邮箱:cooperation@dbnx.example</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<span>© 2026 东北农虾 · 虾路相逢团队 · 第十五届"挑战杯"东北专项 —— 寒地龙虾商品化运营与推广</span>' +
          '<span>高校科技 × 寒地稻田</span>' +
        '</div>' +
      '</div>' +
    '</footer>'

  // 注入导航与页脚
  ;[].forEach.call(document.querySelectorAll('[data-nav]'), function (el) { el.outerHTML = NAV_HTML })
  ;[].forEach.call(document.querySelectorAll('[data-footer]'), function (el) { el.outerHTML = FOOTER_HTML })

  // 当前页高亮
  ;[].forEach.call(document.querySelectorAll('[data-nav-key]'), function (a) {
    if (a.getAttribute('data-nav-key') === PAGE) a.classList.add('active')
  })

  // 移动端菜单
  var toggle = document.querySelector('.nav__toggle')
  var links = document.getElementById('navLinks')
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true'
      toggle.setAttribute('aria-expanded', String(!open))
      links.hidden = open
    })
    ;[].forEach.call(links.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false')
        links.hidden = true
      })
    })
  }

  // 滚动:导航阴影 + 返回顶部
  var navEl = document.querySelector('[data-role="nav"]')
  var toTop = document.querySelector('.to-top')
  function onScroll () {
    var y = window.scrollY
    if (navEl) navEl.classList.toggle('scrolled', y > 10)
    if (toTop) toTop.classList.toggle('show', y > 600)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }) })

  // 滚动显现
  var revealEls = document.querySelectorAll('.fade-up')
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    revealEls.forEach(function (el) { io.observe(el) })
  } else {
    revealEls.forEach(function (el) { el.classList.add('in') })
  }
  // 兜底:无论是否滚动,3.2s 后全部显现,确保整页截图/无IO环境不丢内容
  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add('in') })
  }, 3200)

  // 数字滚动
  var counters = document.querySelectorAll('[data-count]')
  function animateCount (el) {
    var target = parseFloat(el.getAttribute('data-count'))
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10)
    var suffix = el.getAttribute('data-suffix') || ''
    var duration = 1400
    var start = null
    function tick (ts) {
      if (!start) start = ts
      var p = Math.min((ts - start) / duration, 1)
      var eased = 1 - Math.pow(1 - p, 3)
      var val = target * eased
      el.textContent = val.toFixed(decimals) + suffix
      if (p < 1) requestAnimationFrame(tick)
      else el.textContent = (target % 1 === 0 ? target.toLocaleString('zh-CN') : target.toFixed(decimals)) + suffix
    }
    requestAnimationFrame(tick)
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target) }
      })
    }, { threshold: 0.4 })
    counters.forEach(function (el) { cio.observe(el) })
  } else {
    counters.forEach(function (el) {
      el.textContent = parseFloat(el.getAttribute('data-count')).toLocaleString('zh-CN') + (el.getAttribute('data-suffix') || '')
    })
  }

  // 平滑锚点(仅同页)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]')
    if (!a) return
    var href = a.getAttribute('href')
    if (!href || href === '#') return
    var t = document.querySelector(href)
    if (t) {
      e.preventDefault()
      t.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})()
