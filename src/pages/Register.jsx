import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'developer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  // const [showPassword, setShowPassword] = useState(false);     
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password, formData.role);
    
    // if (result.success) {
    //   navigate('/');
    // } else {
    //   setError(result.message);
    // }
    if (result.success) {
  localStorage.setItem('token', result.token);           // Save JWT token
  localStorage.setItem('user', JSON.stringify(result));  // Save user data
  navigate('/');                                // Go to dashboard
} else {
  setError(result.message);
}
    setLoading(false);
  };


  //  // 👁️ Password Eye Toggle Functions
  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  // const toggleConfirmPasswordVisibility = () => {
  //   setShowConfirmPassword(!showConfirmPassword);
  // };

  return (
    <div className="register-page" style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', padding: '20px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="card-custom shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="mb-3">
                    <i className="fas fa-cube text-primary me-2"></i>
                    Yntra
                  </h2>
                  <p className="text-muted">Create your account</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control-custom"
                      placeholder="Enter your full name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control-custom"
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="form-control-custom"
                    >
                      <option value="developer">Developer</option>
                      <option value="manager">Project Manager</option>
                      <option value="admin">Administrator</option>
                      <option value="viewer">Viewer</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control-custom"
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-control-custom"
                      placeholder="Confirm your password"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 btn-primary-custom"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;



// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Alert from 'react-bootstrap/Alert';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // npm i react-icons

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'developer'
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);        // 👁️ Password eye
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👁️ Confirm eye
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     setLoading(true);

//     const result = await register(formData.name, formData.email, formData.password, formData.role);
    
//     if (result.success) {
//       localStorage.setItem('token', result.token);
//       localStorage.setItem('user', JSON.stringify(result));
//       navigate('/');
//     } else {
//       setError(result.message);
//     }
//     setLoading(false);
//   };

//   // 👁️ Password Eye Toggle Functions
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   return (
//     <div className="register-page" style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', padding: '20px' }}>
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={8} lg={6}>
//             <Card className="card-custom shadow">
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <h2 className="mb-3">
//                     <i className="fas fa-project-diagram text-primary me-2"></i>
//                     ProjectHub
//                   </h2>
//                   <p className="text-muted">Create your account</p>
//                 </div>

//                 {error && <Alert variant="danger">{error}</Alert>}

//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Full Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       className="form-control-custom"
//                       placeholder="Enter your full name"
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Email Address</Form.Label>
//                     <Form.Control
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="form-control-custom"
//                       placeholder="Enter your email"
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Role</Form.Label>
//                     <Form.Select
//                       name="role"
//                       value={formData.role}
//                       onChange={handleChange}
//                       className="form-control-custom"
//                     >
//                       <option value="developer">Developer</option>
//                       <option value="manager">Project Manager</option>
//                       <option value="admin">Administrator</option>
//                       <option value="viewer">Viewer</option>
//                     </Form.Select>
//                   </Form.Group>

//                   {/* 👁️ PASSWORD WITH EYE TOGGLE */}
//                   <Form.Group className="mb-4 position-relative">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       className="form-control-custom pe-5"  // Extra padding for eye icon
//                       placeholder="Enter your password"
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
//                       onClick={togglePasswordVisibility}
//                       style={{ border: 'none', background: 'none', zIndex: 10 }}
//                     >
//                       {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//                     </button>
//                   </Form.Group>

//                   {/* 👁️ CONFIRM PASSWORD WITH EYE TOGGLE */}
//                   <Form.Group className="mb-4 position-relative">
//                     <Form.Label>Confirm Password</Form.Label>
//                     <Form.Control
//                       type={showConfirmPassword ? 'text' : 'password'}
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       className="form-control-custom pe-5"  // Extra padding for eye icon
//                       placeholder="Confirm your password"
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
//                       onClick={toggleConfirmPasswordVisibility}
//                       style={{ border: 'none', background: 'none', zIndex: 10 }}
//                     >
//                       {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//                     </button>
//                   </Form.Group>

//                   <Button
//                     variant="primary"
//                     type="submit"
//                     className="w-100 btn-primary-custom"
//                     disabled={loading}
//                   >
//                     {loading ? 'Creating Account...' : 'Register'}
//                   </Button>
//                 </Form>

//                 <div className="text-center mt-4">
//                   <p className="mb-0">
//                     Already have an account?{' '}
//                     <Link to="/login" className="text-decoration-none">
//                       Sign in here
//                     </Link>
//                   </p>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Register;
