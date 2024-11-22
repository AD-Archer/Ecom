import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Customer from './Customer.js';

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'customer_id',
    },
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  order_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Pending',
  },
}, {
  tableName: 'orders',
  timestamps: false,
});

export default Order; 