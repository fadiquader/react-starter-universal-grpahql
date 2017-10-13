/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Sequelize from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(
  'test_graphql_db1',
  'test_graphql_admin1',
  'iamapassword1',
  {
    host: 'localhost',
    dialect: 'postgres',
    define: {
      freezeTableName: true,
    },
  },
);
export default sequelize;
