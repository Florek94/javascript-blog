'use strict';
/*document.getElementById('test-button').addEventListener('click', function(){
    const links = document.querySelectorAll('.titles a');
    console.log('links:', links);
  });*/
{

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
  }

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');


    /*[DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE]add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    console.log('clickedElement:', clickedElement);

    /*[DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post.active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /*[DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);
    /*[DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log(targetArticle);
    /*[DONE] add class 'active' to the correct article */
    const clickedArticle = document.querySelector(articleSelector);
    clickedArticle.classList.add('active');
    console.log(clickedArticle);
  };


  const optArticleSelector = '.post';
  const optTitleSelector = '.post-title';
  const optTitleListSelector = '.titles';
  const optArticleTagsSelector = '.post-tags .list';
  const optArticleAuthorSelector = '.post-author';
  const optTagListSelector = '.tags.list';
  const optCloudClassCount = 5;
  const optCloudClassPrefix = 'tag-size-';
  const optAuthorsListSelector = '.author-name';

  function generateTitleLinks(customSelector = '') {
    /*[DONE] remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    // console.log(titleList);
    let html = '';
    /*[DONE] for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    for (let article of articles) {
      // console.log(articles);
      /*[DONE] get the article id */
      const articleId = article.getAttribute('id');
      // console.log(articleId);
      /*[?] find the title element */

      /*[DONE] get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      // console.log(articleTitle);
      /* create HTML of the link */
      //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);


      // console.log(linkHTML);
      /* insert link into titleList */
      titleList.innerHTML = titleList.innerHTML + linkHTML;
    }
    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  function calculateTagsParams(tags) {
    const params = {
      max: 0,
      min: 999999
    };
    for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');

      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }
    return params;
  }

  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);


    return optCloudClassPrefix + classNumber;
  }


  function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* [DONE] find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* [DONE] find tags wrapper */
      const titleList = article.querySelector(optArticleTagsSelector);
      /* [DONE] make html variable with empty string */
      let html = '';
      /* [DONE] get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      // console.log(articleTags);
      /* [DONE] split tags into array */
      const articleTagsArray = articleTags.split(' ');
      // console.log(articleTagsArray);
      /* [DONE] START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        // console.log(tag);
        /* [DONE] generate HTML of the link */
        // const tagLinkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
        const tagLinkHTMLData = {id: tag, title: tag};
        const tagLinkHTML = templates.tagLink(tagLinkHTMLData);
        // console.log(tagLinkHTML);
        /* add generated code to html variable */
        html += tagLinkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
        /* [DONE] insert HTML of all the links into the tags wrapper */
        titleList.innerHTML = titleList.innerHTML + ' ' + tagLinkHTML;
      }
      /* END LOOP: for every article: */
      /* [NEW] find list of tags in right column */
      const tagList = document.querySelector(optTagListSelector);
      /* [NEW] create variable for all links HTML code */
      // let allTagsHTML = '';
      const allTagsData = {tags: []};
      const tagsParams = calculateTagsParams(allTags);
      console.log('tagsParams:', tagsParams);
      /* [NEW] START LOOP: for each tag in allTags: */
      for (let tag in allTags) {
        /* [NEW] generate code of a link and add it to allTagsHTML */
        const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + ' ' + '</a></li>'
        // allTagsHTML += tagLinkHTML;
        allTagsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateTagClass(allTags[tag], tagsParams)
        });
        /* [NEW] END LOOP: for each tag in allTags: */
      }
      /*[NEW] add HTML from allTagsHTML to tagList */
      // tagList.innerHTML = allTagsHTML;
      tagList.innerHTML = templates.tagCloudLink(allTagsData);
      console.log(allTagsData);
    }
  }

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let tagLink of tagLinks) {
      /* remove class active */
      tagLink.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinksHref = document.querySelectorAll('a[href^="#tag-' + tag + '"]');
    /* START LOOP: for each found tag link */
    for (let tagLinkHref of tagLinksHref) {
      /* add class active */
      tagLinkHref.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');

  }

  function addClickListenersToTags() {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      tagLink.addEventListener('click', tagClickHandler)
    }
    /* add tagClickHandler as event listener for that link */

    /* END LOOP: for each link */
  }

  function generateAuthors() {
    /* [NEW] create a new variable allAuthorNames with an empty object */
    let allAuthors = {}
    /* [DONE] find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* [DONE] find tags wrapper */
      const titleList = article.querySelector(optArticleAuthorSelector);
      /* [DONE] make html variable with empty string */
      let html = '';
      /* [DONE] get author from data-author attribute */
      const authorTags = article.getAttribute('data-author');
      // console.log(articleAutors);
      /* [DONE] generate HTML of the link */
      // const authorLinkHTML = '<span>by </span><a href="#author-' + authorTags + '"><span>' + authorTags + '</span></a>';
      const authorLinkHTMLData = {id: authorTags, title: authorTags};
      const authorLinkHTML = templates.authorLink(authorLinkHTMLData);
      // console.log(tagLinkHTML);
      /* [DONE] add generated code to html variable */
      html += authorLinkHTML;
      /* [NEW] check if this link is NOT already in allAuthors */
      if (!allAuthors[authorTags]) {
        /* [NEW] add tag to allAuthors object */
        allAuthors[authorTags] = 1;
      } else {
        allAuthors[authorTags]++;
      }
      /* [DONE] insert HTML of all the links into the tags wrapper */
      titleList.innerHTML = titleList.innerHTML + authorLinkHTML;
      /* END LOOP: for every article: */
      const authorList = document.querySelector(optAuthorsListSelector);
      /* [NEW] create variable for all links HTML code */
      // let allAuthorsHTML = '';
      const allAuthorsData = {authors: []};
      /* [NEW] START LOOP: for each tag in allAuthors: */
      for (let author in allAuthors) {
        // allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ') ' + '</a></li> ';
        allAuthorsData.authors.push({
          author: author,
          count: allAuthors[author],
       // className: calculateTagClass(allAuthors[author], tagsParams)
        });
      }

      /*[NEW] add HTML from allAutorsHTML to tagList */
      // authorList.innerHTML = allAuthorsHTML;
      authorList.innerHTML = templates.authorCloudLink(allAuthorsData)
    }
  }

  function authorClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const author = href.replace('#author-', '');
    /* find all tag links with class active */
    const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    /* START LOOP: for each active tag link */
    for (let authorLink of authorLinks) {
      /* remove class active */
      authorLink.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const authorLinksHref = document.querySelectorAll('a[href^="#author-' + author + '"]');
    /* START LOOP: for each found tag link */
    for (let authorLinkHref of authorLinksHref) {
      /* add class active */
      authorLinkHref.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');

  }

  function addClickListenersToAuthors() {
    /* find all links to tags */
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    /* START LOOP: for each link */
    for (let authorLink of authorLinks) {
      authorLink.addEventListener('click', authorClickHandler)
    }
    /* add tagClickHandler as event listener for that link */

    /* END LOOP: for each link */
  }

  generateTitleLinks();
  generateTags();
  generateAuthors();

  addClickListenersToTags();
  addClickListenersToAuthors();
}