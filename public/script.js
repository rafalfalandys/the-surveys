"use strict";
function createSurvey(questions, options) {
  /*
    Survey Template.
  
    To configure questions use belows QUESTIONS object. It is an array of questions in JSON format with related options.
    All questions are by default REQUIRED, unless specifically marked as not.
    All text inputs have default limit of 100 characters, unless specifically set to other numeric value.
  
    Questions parameters typing:
      {
        question: string;
        required?: boolean;
        answers: (
            string |
            number |
            { answer: string | number; options?: { isOpen?: boolean; limit?: number; endsSurvey?: boolean } }
          )[];
        type: "single" | "multi" | "scale" | "open" | "date";
        shuffleAnswers?: boolean;
        length?: number;
        limit?: number;
        minDate?: string;
        maxDate?: string;
      };
    
    There are 5 types of questions:
    1) Single choice.
    For example:
  
      {
        type: "single", // required
        question: "Which device do you use most often to browse the internet?", // required
        answers: [
          "Smartphone",
          "Laptop",
          "Tablet",
          {answer: 'Other device', options: {isOpen: true, limit: 30, endsSurvey: true} }
          ], // required
        shuffleAnswers: true, // optional - default false
        required: false // optional - default true
      }
  
      Answers are an array of strings, numbers or objects.
      Object is: {
          answer: string | number,
          options: { isOpen: boolean (default false), limit: number (default 100) ), endsSurvey: boolean (default false) }
        }
      isOpen triggers text input; limit sets maximum characters at this input; endsSurvey - selecting such an answer ends survey.
  
    2) Multiple choice. For example:
  
      {
        type: "multi", // required
        question: "Which features matter most to you in a productivity app?", // required
        answers: [ // required
          "Task management",
          "Calendar integration",
          "Cloud sync",
          {answer: 'Other feature', options: {isOpen: true }}
        ],
        shuffleAnswers: true, // optional - default false
        required: false // optional - default true
      },
      
      Answers are an array of strings, numbers or objects.
      Object is: {
          answer: string | number,
          options: { isOpen: boolean (default false), limit: number (default 100) ), endsSurvey: boolean (default false) }
        }
      isOpen triggers text input; limit sets maximum characters at this input; endsSurvey - selecting such an answer ends survey.
  
    3) Open question. This type is a simple text input. For example:
  
      {
        type: "open", // required
        question: "If you could add one new feature to our product, what would it be and why?", // required
        limit: 250, // optional - default 100
        required: true // optional - default true
      }
  
    4) Scale question. This type is list of buttons with numeric values assigned to it (like 1 to 10). For example:
  
      {
        type: "scale", // required
        question: "How satisfied are you with the overall quality of our product?" // required
        length: 7, // optional - default 10
        required: true // optional - default true
      }
  
    5) Date question. Pick a date.
  
      {
        type: "date", // required
        question: "When did you last purchase something from our store?", // required
        required: true // optional - default true
        minDate: '2020-01-01', // optional - default ''
        maxDate: 'today' // optional - default ''
      }
  
      Minimum and maximum date could be set in YYYY-MM-DD format or set as 'today' which dynamically sets the date to current day
  
  
    After submit all answers come as an object following belows princip:
      {
        question1: "Which device do you use most often to browse the internet?",
        answer1: "Laptop",
        question2: "Which features matter most to you in a productivity app?",
        answer2: ["Cloud sync", "Other feature"],
        answer2_other: "Built-in time tracking",
        question3: "If you could add one new feature to our product, what would it be and why?",
        answer3: "Offline mode with automatic sync once I’m back online" ,
        question4: "How satisfied are you with the overall quality of our product?",
        answer4: "6/7",
        question5: "When did you last purchase something from our store?",
        answer5: "2025-05-17",
      }
    */
  ////////////////////////////////////////////
  ////////////////// config //////////////////
  ////////////////////////////////////////////
  const SURVEY_DESCRIPTION =
    options?.description ||
    "We value your feedback! Please take a moment to complete our satisfaction survey and help us improve our services.";
  const QUESTIONS_PER_PAGE = options?.questionsPerPage || 1;
  const DEFAULT_CHARS_LIMIT = options?.defaultCharsLimit || 100;
  const SURVEY_NAME = options?.surveyName || "Satisfaction survey";
  const TRACK_STEPS = options?.trackSteps || true;
  const VALIDATION_TYPE = options?.validationType || "disableButtons";
  const STYLE_TYPE = "popup";
  const QUESTIONS_DESCRIPTIONS = {
    single: "Select one answer",
    multi: "Select 1 or more questions.",
    open: "Write your answer:",
    scale: "Select your answer.",
    date: "Select your answer.",
  };
  ////////////////////////////////////////////
  ////////////////// helper //////////////////
  ////////////////////////////////////////////
  const hide = (el) => el.classList.add("survey__hidden");
  const show = (el) => el.classList.remove("survey__hidden");
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
  const generateToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
  const mapAnswers = (a) => {
    const answers = a.map((answer) => {
      if (typeof answer === "string" || typeof answer === "number") {
        return {
          answer,
          options: { isOpen: false, limit: DEFAULT_CHARS_LIMIT, endsSurvey: false },
        };
      } else {
        return {
          answer: answer.answer,
          options: {
            limit: answer.options?.limit ?? DEFAULT_CHARS_LIMIT,
            isOpen: answer.options?.isOpen ?? false,
            endsSurvey: answer.options?.endsSurvey ?? false,
          },
        };
      }
    });
    return answers;
  };
  function mapToFixedType(questions) {
    return questions.map((q) => {
      const question = {
        ...q,
        required: q.required ?? true,
      };
      switch (q.type) {
        case "date":
          return {
            ...question,
            minDate: "minDate" in q ? (q.minDate === "today" ? generateToday() : q.minDate) : "",
            maxDate: "maxDate" in q ? (q.maxDate === "today" ? generateToday() : q.maxDate) : "",
          };
        case "multi":
          return {
            ...question,
            answers: mapAnswers(q.answers),
            shuffleAnswers: q.shuffleAnswers ?? false,
          };
        case "scale":
          return {
            ...question,
            length: q.length ?? 5,
          };
        case "single":
          return {
            ...question,
            answers: mapAnswers(q.answers),
            shuffleAnswers: q.shuffleAnswers ?? false,
          };
        case "open":
          return {
            ...question,
            limit: q.limit ?? DEFAULT_CHARS_LIMIT,
          };
        default:
          throw new Error(`Unknown question type: ${question.type}`);
      }
    });
  }
  const shuffle = (arr) => {
    const shuffledArray = arr
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    return shuffledArray;
  };
  ////////////////////////////////////////////
  ////////////////// logic ///////////////////
  ////////////////////////////////////////////
  /*
    QUESTIONS object is full of optional types (like answers could be an array of strings or array of objects with options).
    Handling such an object later requires using type quards in order to place deafult values where needed.
    That makes bugs easier to happen, and generally is just not cool.
    Therefore we map this object to sth where no parameters are optional, so all further code is easier to maintain.
    */
  const mappedQuestions = mapToFixedType(questions);
  const state = {
    totalPages: Math.ceil(mappedQuestions.length / QUESTIONS_PER_PAGE),
    currentPage: 1,
    isScrolling: false,
  };
  ////////////////////////////////////////////
  ////////////////// view ////////////////////
  ////////////////////////////////////////////
  class View {
    _parentEl;
    _firstChildEl;
    _contentEl;
    _templateEl;
    _templateReplacementData;
    constructor(parent, templateId, templateReplacementData) {
      if (typeof parent === "string") this._parentEl = document.querySelector(parent);
      else this._parentEl = parent;
      this._templateEl = document.getElementById(templateId);
      this._firstChildEl = this._templateEl.firstElementChild?.cloneNode(true);
      this._templateReplacementData = templateReplacementData;
      if (templateReplacementData) this._replaceTemplateStrings(this._templateReplacementData);
      this._contentEl = this._firstChildEl.firstElementChild;
      this._render();
    }
    _replaceTemplateStrings(replaceData) {
      for (const [key, value] of Object.entries(replaceData)) {
        const templateStr = `**${key}**`;
        if (typeof value === "string" || typeof value === "number") {
          this._firstChildEl.innerHTML = this._firstChildEl.innerHTML.replaceAll(templateStr, value + "");
        } else if (typeof value === "object") {
          this._replaceTemplateStrings(value);
        }
      }
    }
    _render() {
      this._parentEl.insertAdjacentElement("beforeend", this._contentEl);
    }
    get contentEl() {
      return this._contentEl;
    }
  }
  class SurveyView extends View {
    submitBtn;
    nextBtn;
    previousBtn;
    pagesWrapper;
    visibleQuestions = [];
    _closeBtnEl;
    _surveyWrapper;
    _formEl;
    _finalViewEl;
    _allQuestionEls = [];
    _currentPageEl;
    _totalPagesEl;
    _requiredLegendEl = document.querySelector(".survey__required-description");
    _slideSurveyBtn = document.querySelector(".survey__tab");
    _modalWrapper;
    constructor() {
      super(".survey__main-wrapper", "survey__template", { surveyDescription: SURVEY_DESCRIPTION });
      this.submitBtn = this._contentEl.querySelector(".survey__btn-submit");
      this.nextBtn = this._contentEl.querySelector(".survey__btn-next");
      this.previousBtn = this._contentEl.querySelector(".survey__btn-previous");
      this.pagesWrapper = this._contentEl.querySelector(".survey__pages");
      this._closeBtnEl = this._contentEl.querySelector(".survey__close-btn");
      this._surveyWrapper = this._contentEl.querySelector(".survey__survey-wrapper");
      this._formEl = this._contentEl.querySelector("form");
      this._finalViewEl = this._contentEl.querySelector(".survey__final-view__wrapper");
      this._currentPageEl = this._contentEl.querySelector(".survey__current-page");
      this._totalPagesEl = this._contentEl.querySelector(".survey__total-pages");
      this._modalWrapper = this._parentEl.closest(".modal-wrapper");
      this._addCloseBtnHandler();
      this._showSurvey();
      this._mountQuestions();
      this._setQuestionsPages();
      if (STYLE_TYPE === "slide") this._showSlideBtn();
    }
    addSubmitHandler(handler) {
      this._formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        handler();
      });
    }
    paginate() {
      hide(this._requiredLegendEl);
      this.visibleQuestions = [];
      this._allQuestionEls.forEach((el, i) => {
        const questionNo = +el.dataset.page;
        if (questionNo === state.currentPage) {
          show(el);
          this.visibleQuestions.push(i + 1);
          // show required legend if there is any required question on the page
          if (el.querySelector("[required=true]")) show(this._requiredLegendEl);
        } else {
          hide(el);
        }
      });
      this._currentPageEl.innerText = state.currentPage + "";
      if (VALIDATION_TYPE === "disableButtons") surveyView.checkValidity(state.currentPage);
    }
    showTotalPages(num) {
      this._totalPagesEl.innerText = num + "";
    }
    hideSurvey() {
      hide(this._surveyWrapper);
    }
    showFinalView() {
      show(this._finalViewEl);
    }
    addNextPageHandler(handler) {
      this.nextBtn.addEventListener("click", () => {
        handler("next");
      });
    }
    addPreviousPageHandler(handler) {
      this.previousBtn.addEventListener("click", () => {
        handler("prev");
      });
    }
    addSlideSurveyBtnHandler(handler) {
      this._slideSurveyBtn.addEventListener("click", handler);
    }
    toggleSurveyWrapper() {
      this._modalWrapper?.classList.toggle("survey__slide");
    }
    changeToEndSurveyMode = () => {
      hide(this.nextBtn);
      show(this.submitBtn);
      this.skipValidation();
      this.showTotalPages(state.currentPage);
      if (VALIDATION_TYPE === "disableButtons") setTimeout(() => surveyView.enableButtons(), 0);
    };
    changeToNormalMode(totalPages, currentPage) {
      controlButtons(totalPages, currentPage);
      this.bringBackValidation();
      this.showTotalPages(totalPages);
      if (VALIDATION_TYPE === "disableButtons") this.checkValidity(currentPage);
    }
    async checkValidity(currentPage) {
      // withouth belows delay, selecting checkbox with custom input validates empty input as ok, and enables buttons
      await delay(0);
      const errors = this._allQuestionEls
        .filter((el) => +el.dataset.page === currentPage)
        .map((el) => {
          const inputEls = el.querySelectorAll("input");
          const textareaEls = el.querySelectorAll("textarea");
          const selectEls = el.querySelectorAll("select");
          return [...inputEls, ...textareaEls, ...selectEls];
        })
        .flatMap((el) => [...el].map((input) => input.checkValidity()));
      const isInvalid = errors.includes(false);
      if (VALIDATION_TYPE === "disableButtons") {
        const allInputs = this.contentEl.querySelectorAll("input");
        const isEndSurveyInputChecked = [...allInputs].some(
          (inputEl) => inputEl.checked && inputEl.dataset.endsSurvey === "true",
        );
        if (isEndSurveyInputChecked) {
          this.changeToEndSurveyMode();
        } else if (isInvalid) {
          this.disableButtons();
        } else this.enableButtons();
      }
      return isInvalid;
    }
    enableButtons() {
      [this.nextBtn, this.submitBtn].forEach((btn) => btn.removeAttribute("disabled"));
    }
    disableButtons() {
      [this.nextBtn, this.submitBtn].forEach((btn) => btn.setAttribute("disabled", "true"));
    }
    get formData() {
      const formData = new FormData(this._formEl);
      return formData;
    }
    skipValidation() {
      this.submitBtn.setAttribute("formnovalidate", "true");
    }
    bringBackValidation() {
      this.submitBtn.removeAttribute("formnovalidate");
    }
    _showSlideBtn() {
      this._slideSurveyBtn.removeAttribute("style");
    }
    _setQuestionsPages() {
      this._allQuestionEls.forEach((el, i) => {
        el.dataset.page = Math.ceil((i + 1) / QUESTIONS_PER_PAGE) + "";
      });
    }
    _mountQuestions() {
      mappedQuestions.forEach((question, index) => {
        const questionObj =
          question.type === "single"
            ? new QuestionRadioView(question, index + 1)
            : question.type === "multi"
              ? new QuestionCheckboxView(question, index + 1)
              : question.type === "scale"
                ? new QuestionScaleView(question, index + 1)
                : question.type === "open"
                  ? new QuestionOpenView(question, index + 1)
                  : question.type === "date"
                    ? new QuestionDateView(question, index + 1)
                    : null;
        if (questionObj) this._allQuestionEls.push(questionObj.contentEl);
      });
    }
    _showSurvey() {
      show(this._parentEl);
    }
    _addCloseBtnHandler() {
      this._closeBtnEl.addEventListener("click", () => {
        hide(this._parentEl);
        this._contentEl.remove();
      });
    }
    addEndSurveyHandler(handler) {
      this._formEl.addEventListener("change", (e) => {
        handler(e.target);
      });
    }
    slideSurveyOut() {
      if (!this._modalWrapper) return;
      this._modalWrapper.style.display = "none";
      this._modalWrapper.classList.add("survey__slide");
      setTimeout(() => {
        this._modalWrapper?.removeAttribute("style");
      }, 450);
      setTimeout(() => {
        this._modalWrapper?.classList.remove("modal-slide");
      }, 500);
    }
  }
  class QuestionView extends View {
    _question;
    _questionIndex;
    _answerEls = [];
    _answersContainer;
    _inputEls = [];
    _customCheckboxEls = [];
    _errorTextEl;
    constructor(templateId, question, questionIndex) {
      const replaceObj = {
        ...question,
        answers: undefined, // overriding answers array - keys are not strings there and would crash _replaceTemplateStrings method
        questionIndex,
        questionKey: questionIndex,
        questionDescription: QUESTIONS_DESCRIPTIONS[question.type],
      };
      super(".survey__questions__list", templateId, replaceObj);
      this._question = question;
      this._questionIndex = questionIndex;
      this._answersContainer = this._contentEl.querySelector(".survey__answers__list");
      new QuestionContentView(this._contentEl, replaceObj, this._question.required);
      this._errorTextEl = this._contentEl.querySelector(".survey__error__text");
    }
    _addGenericErrorHandler() {
      this._answerEls.forEach((answerEl, i) => {
        const inputEls = answerEl instanceof HTMLInputElement ? [answerEl] : answerEl.querySelectorAll("input");
        if (VALIDATION_TYPE === "flagRed") {
          inputEls.forEach((inputEl) => {
            inputEl.addEventListener("invalid", this._defaultErrorHandler.bind(this, answerEl, inputEl));
          });
        }
      });
    }
    _defaultErrorHandler(answerEl, inputEl, e) {
      e.preventDefault();
      const customCheckboxEl = answerEl.querySelector(".survey__answer__checkbox");
      const customCheckboxEls = this._contentEl.querySelectorAll(".survey__answer__checkbox");
      // 'invalid' event is trigered for each input. Flag all invalid inputs with error class.
      if (inputEl.type !== "text") customCheckboxEl?.classList.add("survey__error__input");
      inputEl.classList.add("survey__error__input");
      show(this._errorTextEl);
      // fix error after checking an answer
      ["input", "change"].forEach((event) => {
        inputEl.addEventListener(event, () => {
          hide(this._errorTextEl);
          customCheckboxEls.forEach((el) => el.classList.remove("survey__error__input"));
          inputEl.classList.remove("survey__error__input");
        });
      });
      this._moveToFirstPageWithError();
    }
    _moveToFirstPageWithError() {
      // in case errors are handled after submitting the survey - move to the first page the error occurs.
      // in case errors are handled after each page change, belows block does nothing.
      if (+this._contentEl.dataset.page < state.currentPage) {
        state.currentPage = +this._contentEl.dataset.page;
        surveyView.paginate();
        controlButtons(state.totalPages, state.currentPage);
      }
      // scroll to first question that thrown an error
      if (!state.isScrolling) {
        this.contentEl.scrollIntoView({ behavior: "smooth" });
        state.isScrolling = true;
        setTimeout(() => {
          state.isScrolling = false;
        }, 2000);
      }
    }
    _addCheckValidityOnChangeHandler() {
      this._inputEls.forEach((el) => {
        if (el instanceof HTMLInputElement) {
          ["change", "input"].forEach((event) => {
            el.addEventListener(event, () => setTimeout(() => surveyView.checkValidity(state.currentPage), 0));
          });
        } else {
          el.addEventListener("input", (e) => {
            setTimeout(() => surveyView.checkValidity(state.currentPage), 0);
          });
        }
      });
    }
    _addChangeHandler(handler) {
      this._inputEls.forEach((el) => {
        if (el instanceof HTMLInputElement) {
          el.addEventListener("change", (e) => {
            if (e.target) handler(e.target);
          });
        } else {
          el.addEventListener("input", (e) => {
            if (e.target) handler(e.target);
          });
        }
      });
    }
    _addExtraElements(answerObj) {
      const inputEls = answerObj.contentEl.querySelectorAll("input");
      const customCheckboxEl = answerObj.contentEl.querySelector(".survey__answer__checkbox");
      this._answerEls.push(answerObj.contentEl);
      this._inputEls.push(...inputEls);
      if (customCheckboxEl) this._customCheckboxEls.push(customCheckboxEl);
    }
  }
  class QuestionContentView extends View {
    constructor(parent, replaceObj, required) {
      super(parent, "survey__question__content__template", replaceObj);
      const requiredMarkEl = parent.querySelector(".survey__required-mark");
      if (!required) requiredMarkEl.remove();
    }
    _render() {
      this._parentEl.insertAdjacentElement("afterbegin", this._contentEl);
    }
  }
  class AnswerView extends View {
    _inputEl;
    _required;
    constructor(parent, templateId, replaceObj, required) {
      super(parent, templateId, replaceObj);
      this._inputEl = this._contentEl.querySelector("input") || this._contentEl;
      this._required = required;
      this._setRequired();
    }
    _setRequired() {
      if (this._required) this._inputEl.setAttribute("required", "true");
      else this._inputEl.removeAttribute("required");
    }
  }
  class CounterView extends View {
    _inputEl;
    _counterEl;
    constructor(parentEl, limit, inputEl) {
      super(parentEl, "survey__counter__template", { limit });
      this._inputEl = inputEl;
      this._counterEl = this._contentEl.querySelector(".survey__counter--value");
      this.addInputChangeHandler();
    }
    addInputChangeHandler() {
      this._inputEl.addEventListener("input", () => {
        this._counterEl.textContent = this._inputEl.value.length + "";
      });
    }
  }
  ////////////////////////////////////////////
  /////// 0. Question single and multi ///////
  class QuestionClosed extends QuestionView {
    _question;
    constructor(template, question, questionIndex) {
      super(template, question, questionIndex);
      this._question = question;
      this._mountAnswers();
      if (VALIDATION_TYPE === "disableButtons") this._addCheckValidityOnChangeHandler();
    }
    _mountAnswers() {
      const answers = this._question.shuffleAnswers ? shuffle(this._question.answers) : this._question.answers;
      answers.forEach((answer, i) => {
        const replaceObj = {
          answer,
          questionKey: this._questionIndex,
          answerKey: i + 1,
        };
        const answerArgs = [
          this._answersContainer,
          { ...replaceObj, i },
          this._question.required,
          // @ts-expect-error we know it's an object
          answer.options,
        ];
        const answerObj =
          this._question.type === "single" ? new AnswerRadioView(...answerArgs) : new AnswerCheckboxView(...answerArgs);
        this._addExtraElements(answerObj);
      });
    }
  }
  class AnswerClosed extends AnswerView {
    _customInputWrapper;
    _customInputEl;
    _options;
    constructor(parent, templateId, replaceObj, required, options) {
      super(
        parent,
        templateId,
        { ...replaceObj, limit: options.limit, endsSurvey: JSON.stringify(options.endsSurvey) },
        required,
      );
      this._options = options;
      this._customInputWrapper = this._contentEl.querySelector(".survey__custom-input__wrapper");
      this._customInputEl = this._contentEl.querySelector(".survey__custom-input");
      if (!options.isOpen) {
        this._removeCustomInputEl();
      } else {
        hide(this._customInputWrapper);
        this._mountCounter();
        this._addCustomInputHandler();
      }
    }
    _addCustomInputHandler() {
      this._parentEl.addEventListener("click", async () => {
        // need to hop off from task queue as checked parameter is controlled somewhere else in the code, and its proper state needs to be awaited
        await delay(0);
        const inputEl = this._contentEl.querySelector("input");
        if (inputEl?.checked) {
          show(this._customInputWrapper);
          if (this._required) setTimeout(() => this._customInputEl.setAttribute("required", "true"), 0);
        } else {
          hide(this._customInputWrapper);
          this._customInputEl.removeAttribute("required");
          this._customInputEl.value = "";
          // handle change event (counter)
          const event = new Event("input", { bubbles: true });
          this._customInputEl.dispatchEvent(event);
        }
      });
    }
    _removeCustomInputEl() {
      this._customInputEl.remove();
    }
    _mountCounter() {
      new CounterView(this._customInputWrapper, this._options?.limit || DEFAULT_CHARS_LIMIT, this._customInputEl);
    }
  }
  ////////////////////////////////////////////
  ///////// 1. Question type radio //////////
  class QuestionRadioView extends QuestionClosed {
    constructor(question, questionIndex) {
      super("survey__question__template--single", question, questionIndex);
      this._question = question;
      this._addGenericErrorHandler();
    }
  }
  class AnswerRadioView extends AnswerClosed {
    constructor(parent, replaceObj, required, options) {
      super(parent, "survey__answer__template--single", { replaceObj }, required, options);
    }
  }
  ////////////////////////////////////////////
  //////// 2. Question type checkbox /////////
  class QuestionCheckboxView extends QuestionClosed {
    constructor(question, questionIndex) {
      super("survey__question__template--multi", question, questionIndex);
      this._question = question;
      this._addGenericErrorHandler();
      this._addChangeHandler(this._customChangeHandler.bind(this));
    }
    _customChangeHandler() {
      if (!this._question.required) return;
      // handle multiple answer error
      const isValid = this._inputEls.some((el) => el?.checked);
      if (isValid) this._inputEls.forEach((el) => el?.removeAttribute("required"));
      else this._inputEls.forEach((el) => el?.setAttribute("required", "true"));
    }
  }
  class AnswerCheckboxView extends AnswerClosed {
    constructor(parent, replaceObj, required, options) {
      super(parent, "survey__answer__template--multi", { replaceObj }, required, options);
    }
  }
  ////////////////////////////////////////////
  ////////// 3. Question type scale //////////
  class QuestionScaleView extends QuestionView {
    _question;
    constructor(question, questionIndex) {
      super("survey__question--scale__template", question, questionIndex);
      this._question = question;
      this._mountAnswers();
      this._addGenericErrorHandler();
      this._addChangeHandler(this._customChangeHandler.bind(this));
      if (VALIDATION_TYPE === "disableButtons") this._addCheckValidityOnChangeHandler();
    }
    _mountAnswers() {
      const length = this._question.length || 10;
      for (let i = 0; i < length; i++) {
        const replaceObj = {
          questionKey: this._questionIndex,
          answerKey: i + 1,
          limit: this._question.length,
        };
        const required = typeof this._question.required === "undefined" ? true : this._question.required;
        const answerObj = new AnswerScaleView(this._answersContainer, replaceObj, required);
        this._addExtraElements(answerObj);
      }
    }
    _customChangeHandler(target) {
      this._inputEls.forEach((_, i) => {
        if (i < +target.dataset.value) this._customCheckboxEls[i].classList.add("survey__answer--active");
        else this._customCheckboxEls[i].classList.remove("survey__answer--active");
      });
    }
  }
  class AnswerScaleView extends AnswerView {
    constructor(parent, replaceObj, required) {
      super(parent, "survey__answer__template--scale", replaceObj, required);
    }
  }
  ////////////////////////////////////////////
  ////////// 5. Question type text ///////////
  class QuestionOpenView extends QuestionView {
    _textAreaEl;
    constructor(question, questionIndex) {
      super("survey__question--open__template", question, questionIndex);
      this._textAreaEl = this._contentEl.querySelector(".survey__answer textarea");
      this._inputEls.push(this._textAreaEl);
      this._answerEls.push(this._textAreaEl);
      this._setRequired();
      if (VALIDATION_TYPE === "flagRed") this._addCustomErrorHandler();
      new CounterView(this._contentEl, question.limit || DEFAULT_CHARS_LIMIT, this._textAreaEl);
      if (VALIDATION_TYPE === "disableButtons") this._addCheckValidityOnChangeHandler();
    }
    _addCustomErrorHandler() {
      const textEl = this._contentEl.querySelector("textarea");
      textEl.addEventListener("invalid", (e) => {
        e.preventDefault();
        this._customErrorHandler();
      });
    }
    _customErrorHandler() {
      // 'invalid' event is trigered for each input. Flag all invalid inputs with error class.
      this._textAreaEl.classList.add("survey__error__input");
      show(this._errorTextEl);
      // fix error after checking an answer
      this._textAreaEl.addEventListener("input", () => {
        if (this._textAreaEl.value.trim() !== "") {
          hide(this._errorTextEl);
          this._textAreaEl.classList.remove("survey__error__input");
        } else {
          this._textAreaEl.classList.add("survey__error__input");
          show(this._errorTextEl);
        }
      });
      this._moveToFirstPageWithError();
    }
    _setRequired() {
      const required = typeof this._question.required === "undefined" ? true : this._question.required;
      if (!required) this._textAreaEl.removeAttribute("required");
      else this._textAreaEl.setAttribute("required", "true");
    }
  }
  ////////////////////////////////////////////
  ///////// 6. Question type date //////////
  class QuestionDateView extends QuestionView {
    constructor(question, questionIndex) {
      super("survey__question--date__template", question, questionIndex);
      this._question = question;
      const answerContainer = this._contentEl.querySelector(".survey__answer");
      const answerObj = new AnswerDateView(
        answerContainer,
        { ...question, questionKey: this._questionIndex },
        question.required,
      );
      this._inputEls.push(answerObj.contentEl);
      this._answerEls.push(answerObj.contentEl);
      this._addGenericErrorHandler();
      if (VALIDATION_TYPE === "disableButtons") this._addCheckValidityOnChangeHandler();
    }
  }
  class AnswerDateView extends AnswerView {
    constructor(parent, replaceObj, required) {
      super(parent, "survey__answer__template--date", replaceObj, required);
    }
  }
  const surveyView = new SurveyView();
  //////////////////////////////////////////////
  ////////////////// control ///////////////////
  const sendCustomData = async () => {
    const currentPageQuestions = await buildFormDataObject(surveyView.visibleQuestions);
    const dataObj = { ...currentPageQuestions, step: state.currentPage };
    console.log(dataObj);
  };
  const controlPageChange = async (nextOrPrev) => {
    // check validity of questions on current page and block next page. Allow previous.
    if (nextOrPrev === "next") {
      const isInvalid = await surveyView.checkValidity(state.currentPage);
      if (isInvalid) return;
      if (TRACK_STEPS) sendCustomData();
      state.currentPage++;
    }
    if (nextOrPrev === "prev") state.currentPage--;
    surveyView.paginate();
    controlButtons(state.totalPages, state.currentPage);
  };
  const controlButtons = (totalPages, currentPage) => {
    if (totalPages === 1) {
      // number of pages is 1
      show(surveyView.submitBtn);
      hide(surveyView.nextBtn);
      hide(surveyView.previousBtn);
      hide(surveyView.pagesWrapper);
    } else if (totalPages > 1 && currentPage === 1) {
      // number of pages is 2 or more and we are on first page
      hide(surveyView.submitBtn);
      show(surveyView.nextBtn);
      hide(surveyView.previousBtn);
    } else if (totalPages > 1 && currentPage === totalPages) {
      // number of pages is 2 or more and we are on last page
      show(surveyView.submitBtn);
      hide(surveyView.nextBtn);
      show(surveyView.previousBtn);
    } else {
      // number of pages is 3 or more and we are not on first page and not on last page
      hide(surveyView.submitBtn);
      show(surveyView.nextBtn);
      show(surveyView.previousBtn);
    }
  };
  const buildFormDataObject = async (curQuestions) => {
    const dataObj = { surveyName: SURVEY_NAME };
    // building data object
    for (const [inputName, value] of surveyView.formData.entries()) {
      if (!value || (curQuestions && !curQuestions.some((questionNo) => inputName.includes(questionNo + "")))) continue;
      const inputEl = document.querySelector(`[name="${inputName}"]`);
      if (inputEl.type === "checkbox") {
        // multiple values
        if (dataObj[inputName]) {
          // second+ value
          dataObj[inputName].push(value);
        } else {
          // first of multiple values
          dataObj[inputName] = [value];
        }
      } else {
        // all other values
        dataObj[inputName] = value;
      }
    }
    // stringifying multiple answers
    for (const [key, value] of Object.entries(dataObj)) {
      if (typeof value === "object") {
        dataObj[key] = `${JSON.stringify(value)}`;
      }
    }
    return dataObj;
  };
  const controlSubmit = async () => {
    const dataObj = await buildFormDataObject();
    surveyView.hideSurvey();
    surveyView.showFinalView();
    console.log(dataObj);
    if (TRACK_STEPS) sendCustomData();
  };
  const controlEndSurveyModeOff = (inputEl) => {
    if (
      (inputEl.dataset.endsSurvey === "true" && !inputEl.checked) ||
      (inputEl.type === "radio" && inputEl.dataset.endsSurvey === "false")
    ) {
      surveyView.changeToNormalMode(state.totalPages, state.currentPage);
    }
  };
  const controlSlideSurvey = () => {
    surveyView.toggleSurveyWrapper();
  };
  const init = () => {
    surveyView.addSubmitHandler(controlSubmit);
    surveyView.paginate();
    surveyView.showTotalPages(state.totalPages);
    controlButtons(state.totalPages, state.currentPage);
    surveyView.addNextPageHandler(controlPageChange);
    surveyView.addPreviousPageHandler(controlPageChange);
    surveyView.addEndSurveyHandler(controlEndSurveyModeOff);
    //@ts-expect-error slide is a variable defined in the build process
    if (STYLE_TYPE === "slide") {
      surveyView.slideSurveyOut();
      surveyView.addSlideSurveyBtnHandler(controlSlideSurvey);
    }
  };
  init();
}
window.createSurvey = createSurvey; //
