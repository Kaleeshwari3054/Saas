import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch projects
        const projectsRes = await api.getProjects(token);
        const projects = projectsRes || [];
        setRecentProjects(projects.slice(0, 5));

        // Fetch task intelligence
        const intelligenceRes = await api.getTaskIntelligence(token);
        const intelligence = intelligenceRes || {};
        
        // Set urgent tasks
        setUrgentTasks(intelligence.urgentTasks || []);

        // Calculate overall stats
        const allProjectStats = {
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'active').length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          totalTasks: intelligence.totalTasks || 0,
          completedTasks: intelligence.tasksByStatus?.completed || 0,
          overdueTasks: intelligence.overdueTasks || 0,
          highPriorityTasks: intelligence.highPriorityTasks || 0
        };

        setStats(allProjectStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const getHealthScoreClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
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
      'todo': 'badge-todo',
      'in-progress': 'badge-in-progress',
      'review': 'badge-review',
      'completed': 'badge-completed'
    };
    return classes[status] || 'badge-todo';
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </h2>
          <p className="text-muted">Welcome back! Here's your project overview.</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <div className="stat-icon text-primary">
              <i className="fas fa-folder-open"></i>
            </div>
            <div className="stat-value">{stats?.totalProjects || 0}</div>
            <div className="stat-label">Total Projects</div>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <div className="stat-icon text-success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-value">{stats?.completedTasks || 0}</div>
            <div className="stat-label">Completed Tasks</div>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <div className="stat-icon text-warning">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-value">{stats?.overdueTasks || 0}</div>
            <div className="stat-label">Overdue Tasks</div>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <div className="stat-icon text-danger">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-value">{stats?.highPriorityTasks || 0}</div>
            <div className="stat-label">High Priority Tasks</div>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Projects */}
        <Col lg={6} className="mb-4">
          <Card className="card-custom">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>
                <i className="fas fa-folder me-2"></i>
                Recent Projects
              </span>
              <Link to="/projects" className="text-white text-decoration-none">
                View All <i className="fas fa-arrow-right ms-1"></i>
              </Link>
            </Card.Header>
            <Card.Body>
              {recentProjects.length > 0 ? (
                recentProjects.map(project => (
                  <div key={project._id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">
                          <Link to={`/projects/${project._id}`} className="text-decoration-none">
                            {project.name}
                          </Link>
                        </h6>
                        <p className="text-muted small mb-2">{project.description}</p>
                      </div>
                      <span className={`badge ${getPriorityBadgeClass(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="fas fa-tasks me-1"></i>
                        {project.totalTasks || 0} tasks
                      </small>
                      <div className="progress" style={{ width: '150px', height: '8px' }}>
                        <div
                          className="progress-bar"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">{project.progress || 0}%</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">No projects found. Create your first project!</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Urgent Tasks */}
        <Col lg={6} className="mb-4">
          <Card className="card-custom">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>
                <i className="fas fa-exclamation-circle me-2"></i>
                Urgent Tasks
              </span>
              <Link to="/tasks" className="text-white text-decoration-none">
                View All <i className="fas fa-arrow-right ms-1"></i>
              </Link>
            </Card.Header>
            <Card.Body>
              {urgentTasks.length > 0 ? (
                urgentTasks.map(task => (
                  <div key={task._id} className="task-item mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">
                          <Link to={`/tasks/${task._id}`} className="text-decoration-none">
                            {task.title}
                          </Link>
                        </h6>
                        <small className="text-muted">
                          {task.dueDate && `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                        </small>
                      </div>
                      <div>
                        <span className={`badge ${getPriorityBadgeClass(task.priority)} me-2`}>
                          {task.priority}
                        </span>
                        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">No urgent tasks. Great job!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
                <Link to="/projects" className="btn btn-primary-custom">
                  <i className="fas fa-plus me-2"></i>
                  New Project
                </Link>
                <Link to="/tasks" className="btn btn-success-custom">
                  <i className="fas fa-tasks me-2"></i>
                  New Task
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;