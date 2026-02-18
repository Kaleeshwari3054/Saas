import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

const ProjectDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id, token]);

  const fetchProjectDetails = async () => {
    try {
      const projectRes = await api.getProject(id, token);
      const dashboardRes = await api.getProjectDashboard(id, token);
      setProject(projectRes);
      setDashboard(dashboardRes);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
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

  const getHealthScoreClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'todo': 'badge-todo',
      'in-progress': 'badge-in-progress',
      'review': 'badge-review',
      'completed': 'badge-completed'
    };
    return classes[status] || 'badge-todo';
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading project details...</p>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container fluid className="py-4">
        <Card className="card-custom">
          <Card.Body className="text-center py-5">
            <h4>Project Not Found</h4>
            <Link to="/projects" className="btn btn-primary-custom mt-3">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Projects
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Link to="/projects" className="text-decoration-none mb-2 d-inline-block">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Projects
          </Link>
          <h2>
            <i className="fas fa-folder-open me-2"></i>
            {project.name}
          </h2>
          <p className="text-muted">{project.description}</p>
        </Col>
      </Row>

      {/* Project Stats */}
      <Row className="mb-4">
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <div className="stat-icon text-primary">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="stat-value">{dashboard?.stats?.totalTasks || 0}</div>
            <div className="stat-label">Total Tasks</div>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <div className="stat-icon text-success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-value">{dashboard?.stats?.completedTasks || 0}</div>
            <div className="stat-label">Completed</div>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <div className="stat-icon text-warning">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-value">{dashboard?.stats?.overdueTasks || 0}</div>
            <div className="stat-label">Overdue</div>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <div className="stat-icon text-info">
              <i className="fas fa-hourglass-half"></i>
            </div>
            <div className="stat-value">
              {dashboard?.stats?.totalEstimatedHours || 0}h
            </div>
            <div className="stat-label">Estimated Hours</div>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Project Health & Progress */}
        <Col lg={4} className="mb-4">
          <Card className="card-custom">
            <Card.Header>
              <i className="fas fa-heartbeat me-2"></i>
              Project Health
            </Card.Header>
            <Card.Body>
              <div className={`health-score ${getHealthScoreClass(project.healthScore)}`}>
                {project.healthScore || 100}
              </div>
              
              <h6 className="mt-3 mb-3">Progress: {project.progress || 0}%</h6>
              <div className="progress progress-custom">
                <div
                  className="progress-bar"
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>

              <div className="mt-4">
                <h6 className="mb-2">Project Info</h6>
                <div className="row g-2">
                  <Col xs={6}>
                    <small className="text-muted d-block">Status</small>
                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                      {project.status}
                    </span>
                  </Col>
                  <Col xs={6}>
                    <small className="text-muted d-block">Priority</small>
                    <span className={`badge ${getPriorityBadgeClass(project.priority)}`}>
                      {project.priority}
                    </span>
                  </Col>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Task Statistics */}
        <Col lg={8} className="mb-4">
          <Card className="card-custom">
            <Card.Header>
              <i className="fas fa-chart-pie me-2"></i>
              Task Statistics
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <div className="text-center">
                    <div className="badge badge-todo mb-2" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>
                      {dashboard?.stats?.todoTasks || 0}
                    </div>
                    <div className="text-muted">To Do</div>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="text-center">
                    <div className="badge badge-in-progress mb-2" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>
                      {dashboard?.stats?.inProgressTasks || 0}
                    </div>
                    <div className="text-muted">In Progress</div>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="text-center">
                    <div className="badge badge-review mb-2" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>
                      {dashboard?.stats?.reviewTasks || 0}
                    </div>
                    <div className="text-muted">In Review</div>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="text-center">
                    <div className="badge badge-completed mb-2" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>
                      {dashboard?.stats?.completedTasks || 0}
                    </div>
                    <div className="text-muted">Completed</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Workload Balance */}
      {dashboard?.workloadBalance && dashboard.workloadBalance.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="card-custom">
              <Card.Header>
                <i className="fas fa-balance-scale me-2"></i>
                Team Workload Balance
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-custom">
                    <thead>
                      <tr>
                        <th>Team Member</th>
                        <th>Total Tasks</th>
                        <th>Completed</th>
                        <th>Pending</th>
                        <th>Estimated Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.workloadBalance.map((workload, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{workload.userName}</strong>
                              <br />
                              <small className="text-muted">{workload.userEmail}</small>
                            </div>
                          </td>
                          <td>{workload.totalTasks}</td>
                          <td className="text-success">{workload.completedTasks}</td>
                          <td className="text-warning">{workload.pendingTasks}</td>
                          <td>{workload.estimatedHours}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="card-custom">
            <Card.Header>
              <i className="fas fa-bolt me-2"></i>
              Quick Actions
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <Link to={`/tasks?project=${id}`} className="btn btn-primary-custom">
                  <i className="fas fa-plus me-2"></i>
                  Add Task
                </Link>
                <Link to={`/tasks?project=${id}`} className="btn btn-success-custom">
                  <i className="fas fa-list me-2"></i>
                  View All Tasks
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetails;