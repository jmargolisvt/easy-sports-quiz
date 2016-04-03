var Quiz = React.createClass({
  getInitialState: function() {
    return {data: [{}], current:0, userAnswer:"", correct: "", numCorrect: 0};
  },

  loadQuestions: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.loadQuestions();
    $("#answer").focus();
  },

  currentAnswer: function(e){
    this.setState({userAnswer: e.target.value});
  },

  checkAnswer: function(){
    var correct = this.state.userAnswer.trim().toLowerCase() == this.state.data[this.state.current].answer;

    this.setState({correct: correct});
    if (correct == true) {
      this.setState({numCorrect: this.state.numCorrect + 1});
    };
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.checkAnswer();
    if (this.state.current + 1 == this.state.data.length){
      this.setState({current: 0, correct: ''});
      window.confirm("You got " + this.state.numCorrect + " questions right.\n\n Start the quiz again.");
    } else {
      this.setState({current: this.state.current + 1, userAnswer:""});
    }
    $("#answer").focus();
  },

  render: function() {
    return (
      <div>
        <h1 className="text-center">Easy Sports Quiz</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <Question data={this.state.data} current={this.state.current} />
            <p>You have {this.state.numCorrect} correct answers.</p>
            <label htmlFor="answer">Your answer:</label>
            <input type="text" className="form-control" id="answer" placeholder="Your answer here..."
                   onChange={this.currentAnswer} value={this.state.userAnswer} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <br/><br/>
          <Flash correct={this.state.correct}/>
          </form>
        </div>
    );
  }
});

var Question = React.createClass({
  render: function() {
    return (
      <div className="question bg-primary">
        <h2 className="text-center">Question#{this.props.current + 1}</h2>
        <p className="text-center">
          {this.props.data[this.props.current].question}
        </p>
      </div>
    );
  }
});

var Flash = React.createClass({
  render: function() {
    var hide = this.props.correct;
    switch (hide) {
      case true: return (<div className="text-center alert alert-success">You are correct!</div>);
      case false: return (<div className="text-center alert alert-danger">You are incorrect!</div>);
      default: return(<div></div>);
    }
  }
});

ReactDOM.render(
  <Quiz url="/api/questions"/>,
  document.getElementById('content')
);
