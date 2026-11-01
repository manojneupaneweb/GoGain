USE gogain;

-- Password for every sample account is: password
INSERT INTO users (id, fullName, email, phone, password, gender, role, avatar) VALUES
('11111111-1111-4111-8111-111111111111', 'Admin User', 'admin@gogain.test', '9800000001', '$2y$12$diYrnSyXNnPTPIs.ETwZmelmTR3hbT1YZjr3MqmnspS4dnT.0FUtC', 'male', 'admin', NULL),
('22222222-2222-4222-8222-222222222222', 'Asha Trainer', 'trainer@gogain.test', '9800000002', '$2y$12$diYrnSyXNnPTPIs.ETwZmelmTR3hbT1YZjr3MqmnspS4dnT.0FUtC', 'female', 'trainer', NULL),
('33333333-3333-4333-8333-333333333333', 'Ravi Member', 'member@gogain.test', '9800000003', '$2y$12$diYrnSyXNnPTPIs.ETwZmelmTR3hbT1YZjr3MqmnspS4dnT.0FUtC', 'male', 'user', NULL);

INSERT INTO products (id, name, description, price, category, image, stock, warranty, specifications) VALUES
('44444444-4444-4444-8444-444444444444', 'Whey Protein', '1kg whey protein', 2500.00, 'Supplement', 'https://example.com/whey.jpg', 20, '6 months', JSON_ARRAY(JSON_OBJECT('topic', 'Size', 'value', '1kg'))),
('55555555-5555-4555-8555-555555555555', 'Training Gloves', 'Pair of lifting gloves', 800.00, 'Equipment', 'https://example.com/gloves.jpg', 15, '3 months', JSON_ARRAY(JSON_OBJECT('topic', 'Size', 'value', 'M')));

INSERT INTO user_plans (id, user_id, plan_name, start_date, expire_date) VALUES
('66666666-6666-4666-8666-666666666666', '33333333-3333-4333-8333-333333333333', 'Basic', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY));
