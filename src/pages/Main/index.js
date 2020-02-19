import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List, AlertMessage, ToggleButton } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: false,
    showAlert: false,
    alertText: ''
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleToggle = e => {
    this.setState({
      error: false,
      alertText: '',
    });
  }

  handleInputChange = e => {
    this.setState({
      newRepo: e.target.value,
      error: false,
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      this.setState({loading: true});

      let repoName = this.state.newRepo.replace('\\', '/');

      const repository = this.state.repositories.find(i => i.name === repoName);

      if (repository) {
        throw new Error('Repositório já foi adicionado na lista');
      }

      const response = await api.get(`/repos/${repoName}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...this.state.repositories, data],
        newRepo: '',
        loading: false,
        error: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: true,
        alertText: error.message,
      });
    }
  }

  render() {
    const { newRepo, repositories, loading, error, alertText } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            { loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        {error && <AlertMessage >
          <p>{alertText}</p>
          <ToggleButton onClick={this.handleToggle}>
            <MdClose color="#FFF"/>
          </ToggleButton>
        </AlertMessage>}

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
