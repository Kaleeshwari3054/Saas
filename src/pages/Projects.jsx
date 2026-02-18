import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

const Projects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    startDate: '',
    endDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects(token);
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      priority: 'medium',
      startDate: '',
      endDate: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.createProject(formData, token);
      handleCloseModal();
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.deleteProject(id, token);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      'low': 'badge-low',
      'medium': 'badge-medium',
      'high': 'badge-high',
      'critical': 'badge-critical'
    };
    return classes[priority] || 'badge-medium';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'planning': 'badge-todo',
      'active': 'badge-in-progress',
      'on-hold': 'badge-review',
      'completed': 'badge-completed',
      'cancelled': 'badge-low'
    };
    return classes[status] || 'badge-todo';
  };

  const getHealthScoreClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading projects...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="fas fa-folder me-2"></i>
            Projects
          </h2>
          <p className="text-muted">Manage and track your projects</p>
        </Col>
        <Col xs="auto">
          <Button className="btn-primary-custom" onClick={handleShowModal}>
            <i className="fas fa-plus me-2"></i>
            New Project
          </Button>
        </Col>
      </Row>

      {projects.length > 0 ? (
        <Row>
          {projects.map(project => (
            <Col key={project._id} md={6} lg={4} className="mb-4">
              <Card className="card-custom h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>{project.name}</span>
                  <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted mb-3">{project.description}</p>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Progress</small>
                      <small>{project.progress || 0}%</small>
                    </div>
                    <div className="progress progress-custom">
                      <div
                        className="progress-bar"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <Col xs={6}>
                      <small className="text-muted d-block">Priority</small>
                      <span className={`badge ${getPriorityBadgeClass(project.priority)}`}>
                        {project.priority}
                      </span>
                    </Col>
                    <Col xs={6}>
                      <small className="text-muted d-block">Tasks</small>
                      <span>{project.totalTasks || 0}</span>
                    </Col>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Health Score</small>
                    <div className={`health-score ${getHealthScoreClass(project.healthScore)}`}>
                      {project.healthScore || 100}
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <div className="d-flex gap-2">
                    <Link to={`/projects/${project._id}`} className="btn btn-primary-custom flex-grow-1">
                      <i className="fas fa-eye me-1"></i> View
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(project._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="card-custom">
          <Card.Body className="text-center py-5">
            <i className="fas fa-folder-open fa-4x text-muted mb-4"></i>
            <h4>No Projects Yet</h4>
            <p className="text-muted">Create your first project to get started!</p>
            <Button className="btn-primary-custom" onClick={handleShowModal}>
              <i className="fas fa-plus me-2"></i>
              Create Project
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Create Project Modal */}
      <Modal show={showModal} onHide={handleCloseModal} className="modal-custom">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus me-2"></i>
            Create New Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="Enter project name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="Enter project description"
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-control-custom"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control-custom"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control-custom"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="btn-primary-custom flex-grow-1"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Projects;