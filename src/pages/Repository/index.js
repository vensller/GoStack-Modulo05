import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, IssueStatus, Pagination } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      })
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'all',
          per_page: 5,
          page: 1,
        }
      })
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      status: 'all',
      page: 1,
    });
  }

  async componentDidUpdate(_, prevState) {
    if (prevState.status !== this.state.status || prevState.page !== this.state.page){
      const issues = await api.get(`/repos/${this.state.repository.full_name}/issues`, {
        params: {
          state: this.state.status,
          per_page: 5,
          page: this.state.page,
        }
      });

      this.setState({ issues: issues.data });
    }
  }

  async handleShowIssues(status) {
    this.setState({ status: status });
  }

  async handlePageChange(increase) {
    this.setState({page: this.state.page + increase});
  }

  render () {
    const { repository, issues, loading, page, status } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueStatus>
          <button onClick={() => this.handleShowIssues('all')}>All</button>
          <button onClick={() => this.handleShowIssues('open')}>Open</button>
          <button onClick={() => this.handleShowIssues('closed')}>Closed</button>
        </IssueStatus>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                  <p>{issue.user.login}</p>
                </strong>
              </div>
            </li>
          ))}
        </IssueList>

        <Pagination>
          <button disabled={page === 1} onClick={() => this.handlePageChange(-1)}>
            <MdNavigateBefore color="#fff" />
          </button>
          <strong>{`${page} - ${status}`}</strong>
          <button onClick={() => this.handlePageChange(+1)}>
            <MdNavigateNext color="#fff" />
          </button>
        </Pagination>
      </Container>
    );
  }
}
