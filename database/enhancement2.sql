-- Query 1 Add record to client table 
INSERT INTO public.client (client_firstname, client_lastname, client_email, 
						   client_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2 Alter a column value in the client table 
UPDATE public.client 
SET client_type = 'Admin'
WHERE client_id = 1;

-- Query 3 Delete record from client table 
DELETE FROM public.client
WHERE client_id = 1;

-- Query 4 Update column data in inventory table 
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interiors')
WHERE inv_id = 10;

-- Query 5 Use inner join to view vehicles with a 'Sport' classification 
SELECT inv_make, inv_model, classification_name
FROM inventory AS i
	INNER JOIN classification AS c
		ON i.classification_id = c.classification_id
WHERE c.classification_id = 2;

-- Query 6 Update the file path names for inv_image and inv_thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail= REPLACE(inv_thumbnail, '/images', '/images/vehicles');

	

