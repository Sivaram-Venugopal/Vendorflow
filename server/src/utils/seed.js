import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import {
  User,
  Vendor,
  Evaluation,
  PurchaseOrder,
  AuditLog,
} from '../models/index.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting VendorFlow Database Seeder...');
    await connectDB();

    // Clear existing collections
    console.log('🧹 Purging existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Evaluation.deleteMany({}),
      PurchaseOrder.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);
    console.log('✅ Cleared User, Vendor, Evaluation, PurchaseOrder, and AuditLog collections.');

    // 1. Seed Users (Admin, Buyers, Vendors)
    console.log('👤 Seeding Users...');
    const users = await User.create([
      {
        name: 'Sarah Chen (Admin)',
        email: 'admin@vendorflow.io',
        password: 'Password123!',
        role: 'Admin',
        phone: '+91 98765 43210',
        department: 'Operations & Procurement Governance',
      },
      {
        name: 'Michael Scott (Buyer)',
        email: 'buyer@vendorflow.io',
        password: 'Password123!',
        role: 'Buyer',
        phone: '+91 98765 43211',
        department: 'Direct Materials Procurement',
      },
      {
        name: 'Elena Rostova (Buyer)',
        email: 'elena.buyer@vendorflow.io',
        password: 'Password123!',
        role: 'Buyer',
        phone: '+91 98765 43212',
        department: 'IT Hardware & Cloud Infrastructure',
      },
      {
        name: 'Rajesh Sharma (Vendor - Apex)',
        email: 'vendor.apex@example.com',
        password: 'Password123!',
        role: 'Vendor',
        phone: '+91 98765 43213',
        department: 'Sales & Commercials',
      },
      {
        name: 'Anita Desai (Vendor - CyberTech)',
        email: 'vendor.cyber@example.com',
        password: 'Password123!',
        role: 'Vendor',
        phone: '+91 98765 43214',
        department: 'Enterprise Solutions',
      },
    ]);

    const adminUser = users[0];
    const buyer1 = users[1];
    const buyer2 = users[2];
    const vendorUser1 = users[3];
    const vendorUser2 = users[4];
    console.log(`✅ Seeded ${users.length} Users.`);

    // 2. Seed Vendors (linked to Vendor Users)
    console.log('🏢 Seeding Vendors...');
    const vendors = await Vendor.create([
      {
        owner: vendorUser1._id,
        companyName: 'Apex Industrial Supplies Pvt Ltd',
        legalEntityName: 'Apex Industrial Supplies Private Limited',
        businessType: 'Private Limited',
        category: 'Raw Materials',
        taxId: '29ABCDE1234F1Z5',
        panNumber: 'ABCDE1234F',
        contactEmail: 'contact@apexsupplies.com',
        contactPhone: '+91 80 2345 6789',
        address: {
          street: '42 Peenya Industrial Area, 3rd Phase',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          postalCode: '560058',
        },
        bankDetails: {
          bankName: 'HDFC Bank Ltd',
          accountNumber: '50200012345678',
          ifscCode: 'HDFC0001234',
          branchName: 'Peenya Branch',
        },
        status: 'Approved',
        complianceScore: 94,
        overallRating: 4.6,
        documents: [
          {
            documentType: 'GST_CERTIFICATE',
            documentUrl: 'https://docs.vendorflow.io/apex-gst.pdf',
            fileName: 'apex-gst-2026.pdf',
            verified: true,
          },
          {
            documentType: 'PAN_CARD',
            documentUrl: 'https://docs.vendorflow.io/apex-pan.pdf',
            fileName: 'apex-pan-card.pdf',
            verified: true,
          },
        ],
      },
      {
        owner: vendorUser2._id,
        companyName: 'CyberTech Networks & Solutions',
        legalEntityName: 'CyberTech Enterprise Solutions LLP',
        businessType: 'LLP',
        category: 'Hardware',
        taxId: '27AABCC9876M1Z2',
        panNumber: 'AABCC9876M',
        contactEmail: 'sales@cybertechnet.com',
        contactPhone: '+91 22 8765 4321',
        address: {
          street: '102 Mindspace Tech Park, Malad West',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400064',
        },
        bankDetails: {
          bankName: 'ICICI Bank Ltd',
          accountNumber: '001105009988',
          ifscCode: 'ICIC0000011',
          branchName: 'Mindspace Branch',
        },
        status: 'Approved',
        complianceScore: 88,
        overallRating: 4.2,
        documents: [
          {
            documentType: 'GST_CERTIFICATE',
            documentUrl: 'https://docs.vendorflow.io/cyber-gst.pdf',
            fileName: 'cybertech-gst-cert.pdf',
            verified: true,
          },
        ],
      },
    ]);

    const vendor1 = vendors[0];
    const vendor2 = vendors[1];
    console.log(`✅ Seeded ${vendors.length} Vendors.`);

    // 3. Seed Evaluations (linked to Vendor + Evaluator User)
    console.log('⭐ Seeding Evaluations...');
    const evaluations = await Evaluation.create([
      {
        vendor: vendor1._id,
        evaluator: buyer1._id,
        period: 'Q4-2025',
        qualityScore: 4.8,
        deliveryScore: 4.5,
        pricingScore: 4.3,
        complianceScore: 4.9,
        recommendation: 'Preferred',
        feedbackComments:
          'Consistent high-grade raw metal supply with 99.2% on-time delivery metric.',
      },
      {
        vendor: vendor2._id,
        evaluator: buyer2._id,
        period: 'Q4-2025',
        qualityScore: 4.2,
        deliveryScore: 4.0,
        pricingScore: 4.1,
        complianceScore: 4.5,
        recommendation: 'Approved',
        feedbackComments:
          'Good technical networking gear fulfillment; slight lead-time delays during holidays.',
      },
    ]);
    console.log(`✅ Seeded ${evaluations.length} Evaluations.`);

    // 4. Seed Purchase Orders (linked to Vendor + Buyer User)
    console.log('📦 Seeding Purchase Orders...');
    const pos = await PurchaseOrder.create([
      {
        poNumber: 'PO-2026-001',
        vendor: vendor1._id,
        buyer: buyer1._id,
        title: 'Raw Aluminum & Industrial Fasteners Q1 Batch',
        currency: 'INR',
        items: [
          {
            itemCode: 'ALU-GRADE-6061',
            description: 'Aluminum Alloy 6061 T6 Billets (1000 kg)',
            quantity: 5,
            unitPrice: 280000,
          },
          {
            itemCode: 'FAST-SS-M8',
            description: 'Stainless Steel M8 Flange Bolts (Box of 500)',
            quantity: 20,
            unitPrice: 3500,
          },
        ],
        taxAmount: 264600, // 18% GST on (1,400,000 + 70,000)
        status: 'Issued',
        deliveryDate: new Date('2026-11-15'),
        shippingAddress: {
          street: 'Warehouse B, Plot 14, Electronic City',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          postalCode: '560100',
        },
        notes: 'Deliver strictly with inspection test certificate and mill test reports.',
      },
      {
        poNumber: 'PO-2026-002',
        vendor: vendor2._id,
        buyer: buyer2._id,
        title: 'Enterprise Core Switch & Fiber Optic Transceivers',
        currency: 'INR',
        items: [
          {
            itemCode: 'NET-SW-48P',
            description: '48-Port Managed L3 Gigabit PoE+ Switch',
            quantity: 3,
            unitPrice: 145000,
          },
          {
            itemCode: 'SFP-10G-SR',
            description: '10GBASE-SR SFP+ 850nm Multimode Transceiver',
            quantity: 12,
            unitPrice: 4200,
          },
        ],
        taxAmount: 87372, // 18% GST on (435,000 + 50,400)
        status: 'Acknowledged',
        deliveryDate: new Date('2026-10-30'),
        shippingAddress: {
          street: 'Data Center 4, Tech Mahindra Road, Hinjewadi',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '411057',
        },
        notes: 'Includes manufacturer warranty documentation and serial number registration.',
      },
    ]);
    console.log(`✅ Seeded ${pos.length} Purchase Orders.`);

    // 5. Seed Audit Logs (linked to User + Entity)
    console.log('📝 Seeding Audit Logs...');
    const auditLogs = await AuditLog.create([
      {
        user: adminUser._id,
        action: 'VENDOR_APPROVED',
        entityType: 'Vendor',
        entityId: vendor1._id,
        details: {
          companyName: vendor1.companyName,
          verifiedDocuments: 2,
          approvalReason: 'Full compliance verified with verified GST and PAN details',
        },
        ipAddress: '192.168.1.10',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      {
        user: buyer1._id,
        action: 'PO_CREATED',
        entityType: 'PurchaseOrder',
        entityId: pos[0]._id,
        details: {
          poNumber: pos[0].poNumber,
          totalAmount: pos[0].totalAmount,
          vendor: vendor1.companyName,
        },
        ipAddress: '192.168.1.45',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      {
        user: buyer1._id,
        action: 'EVALUATION_SUBMITTED',
        entityType: 'Evaluation',
        entityId: evaluations[0]._id,
        details: {
          vendor: vendor1.companyName,
          period: evaluations[0].period,
          overallScore: evaluations[0].overallScore,
        },
        ipAddress: '192.168.1.45',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    ]);
    console.log(`✅ Seeded ${auditLogs.length} Audit Logs.`);

    console.log('----------------------------------------------------');
    console.log('🎉 VendorFlow database seed successfully completed!');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
