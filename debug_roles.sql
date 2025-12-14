-- Check your roles table to see what role_id 1 corresponds to
SELECT * FROM roles;

-- Expected output should be something like:
-- id | name
-- 1  | admin
-- 2  | manager
-- 3  | super-admin

-- If your roles table is empty or doesn't have the right data, run:
INSERT INTO roles (id, name) VALUES 
  (1, 'admin'),
  (2, 'manager'),
  (3, 'super-admin')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Verify the user has the correct role_id
SELECT 
  u.code_pin,
  u.emailEmp,
  u.nomEmp,
  u.role_id,
  r.name as role_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.emailEmp = 'Maryem@email.com';
