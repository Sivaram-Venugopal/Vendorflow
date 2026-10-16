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

export const seedDatabase = async (isStandalone = false) => {
  try {
    console.log('🌱 Starting VendorFlow Database Seeder...');
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

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

    // 1. Seed Users (Admin, 4 Buyers, 6 Vendors)
    console.log('👤 Seeding Users...');
    const users = await User.create([
      // Admin
      {
        name: 'Sarah Chen (Admin)',
        email: 'admin@vendorflow.io',
        password: 'Password123!',
        role: 'Admin',
        phone: '+91 98765 43210',
        department: 'Corporate Governance & Auditing',
      },
      // Buyers
      {
        name: 'Michael Scott (Buyer)',
        email: 'buyer@vendorflow.io',
        password: 'Password123!',
        role: 'Buyer',
        phone: '+91 98765 43211',
        department: 'Direct Materials Sourcing',
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
        name: 'David Kim (Buyer)',
        email: 'david.buyer@vendorflow.io',
        password: 'Password123!',
        role: 'Buyer',
        phone: '+91 98765 43215',
        department: 'Chemicals & Packaging Procurement',
      },
      {
        name: 'Priya Nambiar (Buyer)',
        email: 'priya.buyer@vendorflow.io',
        password: 'Password123!',
        role: 'Buyer',
        phone: '+91 98765 43216',
        department: 'Automation, Robotics & Spares',
      },
      // Vendor Contacts
      {
        name: 'Rajesh Sharma (Vendor - Apex)',
        email: 'vendor.apex@example.com',
        password: 'Password123!',
        role: 'Vendor',
        phone: '+91 98765 43213',
        department: 'Key Accounts & Commercials',
      },
      {
        name: 'Anita Desai (Vendor - CyberTech)',
        email: 'vendor.cyber@example.com',
        password: 'Password123!',
        role: 'Vendor',
        phone: '+91 98765 43214',
        department: 'Enterprise IT Solutions',
      },
      {
        name: 'Vikram Malhotra (Vendor - TitanSteel)',
        email: 'vendor.titan@example.com',
        password: 'Password123!',
        role: 'Vendor',
        phone: '+91 98765 43217',
        department: 'Industrial Castings & Forgings',
      },
      {
        name: 'Sunil Rao (Vendor - Zenith Solar)',
        email: 'vendor.zenith@example.com',
        password: 'Password123!',
        role: 'Vendor',
        phone: '+91 98765 43218',
        department: 'Renewable Power Contracts',
      },
      {
        name: 'Dr. Maya Patel (Vendor - Nova BioMed)',
        email: 'vendor.nova@example.com',
        password: 'Password123!',
        role: 'Vendor',
        phone: '+91 98765 43219',
        department: 'Clinical Instruments & Labs',
      },
      {
        name: 'Carlos Mendez (Vendor - Global Freight)',
        email: 'vendor.freight@example.com',
        password: 'Password123!',
        role: 'Vendor',
        phone: '+91 98765 43220',
        department: 'Cold-Chain & Cargo Logistics',
      },
    ]);

    const adminUser = users[0];
    const buyer1 = users[1]; // Michael
    const buyer2 = users[2]; // Elena
    const buyer3 = users[3]; // David
    const buyer4 = users[4]; // Priya

    const vendorUser1 = users[5]; // Apex
    const vendorUser2 = users[6]; // CyberTech
    const vendorUser3 = users[7]; // TitanSteel
    const vendorUser4 = users[8]; // Zenith
    const vendorUser5 = users[9]; // Nova
    const vendorUser6 = users[10]; // Freight

    console.log(`✅ Seeded ${users.length} Users.`);

    // 2. Seed Vendors
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
        complianceScore: 96,
        overallRating: 4.8,
        tier: 'Gold',
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
        complianceScore: 90,
        overallRating: 4.4,
        tier: 'Silver',
        documents: [
          {
            documentType: 'GST_CERTIFICATE',
            documentUrl: 'https://docs.vendorflow.io/cyber-gst.pdf',
            fileName: 'cybertech-gst-cert.pdf',
            verified: true,
          },
        ],
      },
      {
        owner: vendorUser3._id,
        companyName: 'TitanSteel Precision Forgings Ltd',
        legalEntityName: 'TitanSteel Heavy Engineering Public Ltd',
        businessType: 'Public Limited',
        category: 'Raw Materials',
        taxId: '33AABCT8844K1ZR',
        panNumber: 'AABCT8844K',
        contactEmail: 'procure@titansteel.in',
        contactPhone: '+91 44 2654 9988',
        address: {
          street: 'SIPCOT Industrial Park, Sector 4',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          postalCode: '602105',
        },
        bankDetails: {
          bankName: 'State Bank of India',
          accountNumber: '304859384920',
          ifscCode: 'SBIN0004321',
          branchName: 'SIPCOT Sriperumbudur',
        },
        status: 'Approved',
        complianceScore: 98,
        overallRating: 4.9,
        tier: 'Gold',
        documents: [
          {
            documentType: 'GST_CERTIFICATE',
            documentUrl: 'https://docs.vendorflow.io/titan-gst.pdf',
            fileName: 'titan-steel-gstin.pdf',
            verified: true,
          },
          {
            documentType: 'MSME_CERTIFICATE',
            documentUrl: 'https://docs.vendorflow.io/titan-msme.pdf',
            fileName: 'titan-msme-registration.pdf',
            verified: true,
          },
        ],
      },
      {
        owner: vendorUser4._id,
        companyName: 'Zenith Renewable Energy Systems',
        legalEntityName: 'Zenith CleanTech Solutions Pvt Ltd',
        businessType: 'Private Limited',
        category: 'Hardware',
        taxId: '36AAACZ7766L1ZP',
        panNumber: 'AAACZ7766L',
        contactEmail: 'commercials@zenithsolar.org',
        contactPhone: '+91 40 4567 1234',
        address: {
          street: 'HITEC City Phase 2, Madhapur',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          postalCode: '500081',
        },
        bankDetails: {
          bankName: 'Axis Bank Ltd',
          accountNumber: '91802003847281',
          ifscCode: 'UTIB0001020',
          branchName: 'Madhapur Branch',
        },
        status: 'Approved',
        complianceScore: 92,
        overallRating: 4.5,
        tier: 'Silver',
        documents: [
          {
            documentType: 'GST_CERTIFICATE',
            documentUrl: 'https://docs.vendorflow.io/zenith-gst.pdf',
            fileName: 'zenith-solar-gst.pdf',
            verified: true,
          },
        ],
      },
      {
        owner: vendorUser5._id,
        companyName: 'Nova BioMed Diagnostics & Labs',
        legalEntityName: 'Nova Diagnostics & Life Sciences LLP',
        businessType: 'LLP',
        category: 'Services',
        taxId: '07AABCN5544J1ZK',
        panNumber: 'AABCN5544J',
        contactEmail: 'contact@novabiomed.org',
        contactPhone: '+91 11 2839 0012',
        address: {
          street: 'Okhla Industrial Area Phase 1',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110020',
        },
        bankDetails: {
          bankName: 'Kotak Mahindra Bank',
          accountNumber: '293847562019',
          ifscCode: 'KKBK0000192',
          branchName: 'Okhla Branch',
        },
        status: 'Under Review',
        complianceScore: 82,
        overallRating: 3.9,
        tier: 'Bronze',
        documents: [
          {
            documentType: 'GST_CERTIFICATE',
            documentUrl: 'https://docs.vendorflow.io/nova-gst.pdf',
            fileName: 'nova-gst-pending.pdf',
            verified: false,
          },
        ],
      },
      {
        owner: vendorUser6._id,
        companyName: 'Global Freight & Express Logistics',
        legalEntityName: 'Global Logistics & Supply Chain Solutions Ltd',
        businessType: 'Public Limited',
        category: 'Logistics',
        taxId: '24AABCG1122D1ZQ',
        panNumber: 'AABCG1122D',
        contactEmail: 'operations@globalfreight.in',
        contactPhone: '+91 79 3847 2211',
        address: {
          street: 'Mundra Logistics Park, Port Area',
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          postalCode: '382170',
        },
        bankDetails: {
          bankName: 'HDFC Bank Ltd',
          accountNumber: '50200088776655',
          ifscCode: 'HDFC0000456',
          branchName: 'Mundra Logistics Desk',
        },
        status: 'Approved',
        complianceScore: 95,
        overallRating: 4.7,
        tier: 'Gold',
        documents: [
          {
            documentType: 'GST_CERTIFICATE',
            documentUrl: 'https://docs.vendorflow.io/freight-gst.pdf',
            fileName: 'global-freight-gst.pdf',
            verified: true,
          },
        ],
      },
    ]);

    const [vApex, vCyber, vTitan, vZenith, vNova, vFreight] = vendors;
    console.log(`✅ Seeded ${vendors.length} Vendors across 6 enterprise categories.`);

    // 3. Seed Evaluations
    console.log('⭐ Seeding Evaluations...');
    const evaluations = await Evaluation.create([
      {
        vendor: vApex._id,
        evaluator: buyer1._id,
        period: 'Q4-2025',
        qualityScore: 4.8,
        deliveryScore: 4.7,
        pricingScore: 4.4,
        complianceScore: 4.9,
        recommendation: 'Preferred',
        feedbackComments: 'High-grade aluminum billets and precision fasteners with 99.4% on-time delivery.',
      },
      {
        vendor: vApex._id,
        evaluator: buyer1._id,
        period: 'Q1-2026',
        qualityScore: 4.9,
        deliveryScore: 4.8,
        pricingScore: 4.5,
        complianceScore: 5.0,
        recommendation: 'Preferred',
        feedbackComments: 'Zero defects observed during third-party ultrasonic metallurgy testing.',
      },
      {
        vendor: vCyber._id,
        evaluator: buyer2._id,
        period: 'Q4-2025',
        qualityScore: 4.3,
        deliveryScore: 4.1,
        pricingScore: 4.2,
        complianceScore: 4.6,
        recommendation: 'Approved',
        feedbackComments: 'High reliability on enterprise core switches; slight holiday freight delays.',
      },
      {
        vendor: vTitan._id,
        evaluator: buyer4._id,
        period: 'Q1-2026',
        qualityScore: 5.0,
        deliveryScore: 4.9,
        pricingScore: 4.6,
        complianceScore: 4.9,
        recommendation: 'Preferred',
        feedbackComments: 'Superior heavy forging tolerances within ±0.02mm for robotic arms.',
      },
      {
        vendor: vZenith._id,
        evaluator: buyer2._id,
        period: 'Q1-2026',
        qualityScore: 4.6,
        deliveryScore: 4.4,
        pricingScore: 4.3,
        complianceScore: 4.7,
        recommendation: 'Approved',
        feedbackComments: 'Tier-1 inverter efficiency verified during high-temperature test cycle.',
      },
      {
        vendor: vFreight._id,
        evaluator: buyer3._id,
        period: 'Q1-2026',
        qualityScore: 4.7,
        deliveryScore: 4.8,
        pricingScore: 4.5,
        complianceScore: 4.8,
        recommendation: 'Preferred',
        feedbackComments: 'Flawless cold-chain temperature telemetry with GPS live tracking API integration.',
      },
    ]);
    console.log(`✅ Seeded ${evaluations.length} Evaluations.`);

    // 4. Seed Purchase Orders
    console.log('📦 Seeding Purchase Orders across lifecycle states...');
    const pos = await PurchaseOrder.create([
      {
        poNumber: 'PO-2026-001',
        vendor: vApex._id,
        buyer: buyer1._id,
        title: 'Raw Aluminum Alloy 6061 & Fasteners Batch',
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
        taxAmount: 264600,
        status: 'Sent',
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
        vendor: vCyber._id,
        buyer: buyer2._id,
        title: 'Enterprise Core Switch & Fiber Optic Transceivers',
        currency: 'INR',
        items: [
          {
            itemCode: 'NET-SW-48P',
            description: '48-Port Managed L3 Gigabit PoE+ Switch',
            quantity: 4,
            unitPrice: 145000,
          },
          {
            itemCode: 'SFP-10G-SR',
            description: '10GBASE-SR SFP+ 850nm Multimode Transceiver',
            quantity: 16,
            unitPrice: 4200,
          },
        ],
        taxAmount: 116496,
        status: 'Acknowledged',
        deliveryDate: new Date('2026-10-30'),
        shippingAddress: {
          street: 'Data Center 4, Tech Mahindra Road, Hinjewadi',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '411057',
        },
        notes: 'Includes manufacturer 5-year warranty documentation.',
      },
      {
        poNumber: 'PO-2026-003',
        vendor: vTitan._id,
        buyer: buyer4._id,
        title: 'Precision CNC Robotic Arm Forgings & Castings',
        currency: 'INR',
        items: [
          {
            itemCode: 'ROBO-FORGE-ARM',
            description: 'Titanium-Alloy 6-Axis Robotic Forearm Casting',
            quantity: 12,
            unitPrice: 75000,
          },
          {
            itemCode: 'BRG-CERAMIC-90',
            description: 'High-Speed Sealed Ceramic Bearings 90mm',
            quantity: 24,
            unitPrice: 12500,
          },
        ],
        taxAmount: 216000,
        status: 'Acknowledged',
        deliveryDate: new Date('2026-11-20'),
        shippingAddress: {
          street: 'Robotics Assembly Plant, Sanand Industrial Area',
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          postalCode: '382110',
        },
        notes: 'CMM dimensional inspection reports required upon dispatch.',
      },
      {
        poNumber: 'PO-2026-004',
        vendor: vZenith._id,
        buyer: buyer2._id,
        title: 'Hybrid Commercial Solar Inverters 50kW & Batteries',
        currency: 'INR',
        items: [
          {
            itemCode: 'SOLAR-INV-50KW',
            description: '50kW Three-Phase Grid-Tied Solar Inverter',
            quantity: 3,
            unitPrice: 320000,
          },
          {
            itemCode: 'BAT-LFP-15KWH',
            description: 'Lithium Iron Phosphate (LiFePO4) 15kWh Rack',
            quantity: 6,
            unitPrice: 210000,
          },
        ],
        taxAmount: 399600,
        status: 'Approved',
        deliveryDate: new Date('2026-12-05'),
        shippingAddress: {
          street: 'Green Campus Site 2, Outer Ring Road',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          postalCode: '500032',
        },
        notes: 'Commissioning assistance included in commercial quotation.',
      },
      {
        poNumber: 'PO-2026-005',
        vendor: vFreight._id,
        buyer: buyer3._id,
        title: 'Temperature-Controlled Freight Logistics Contract Q1',
        currency: 'INR',
        items: [
          {
            itemCode: 'LOG-REEFER-KM',
            description: 'Interstate Refrigerated Reefer Container (-20°C to +4°C)',
            quantity: 10,
            unitPrice: 65000,
          },
        ],
        taxAmount: 117000,
        status: 'Delivered',
        deliveryDate: new Date('2026-10-10'),
        shippingAddress: {
          street: 'Central Distribution Hub, Peenya Phase 2',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          postalCode: '560058',
        },
        notes: 'GPS telemetry logged and verified within acceptable variance.',
      },
      {
        poNumber: 'PO-2026-006',
        vendor: vApex._id,
        buyer: buyer1._id,
        title: 'Emergency CNC Fastener Spares & Hex Bolts',
        currency: 'INR',
        items: [
          {
            itemCode: 'HEX-BOLT-GRADE8',
            description: 'High-Tensile Grade 8.8 Hexagon Head Screws',
            quantity: 50,
            unitPrice: 950,
          },
        ],
        taxAmount: 8550,
        status: 'Closed',
        deliveryDate: new Date('2026-09-25'),
        shippingAddress: {
          street: 'Warehouse B, Plot 14, Electronic City',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          postalCode: '560100',
        },
        notes: '3-way reconciliation completed and payment settled.',
      },
    ]);
    console.log(`✅ Seeded ${pos.length} Purchase Orders across all states.`);

    // 5. Seed Audit Logs
    console.log('📝 Seeding Audit Logs...');
    await AuditLog.create([
      {
        user: adminUser._id,
        action: 'VENDOR_APPROVED',
        entityType: 'Vendor',
        entityId: vApex._id,
        details: { companyName: vApex.companyName, reason: 'Full GST and PAN compliance validated' },
        ipAddress: '192.168.1.10',
      },
      {
        user: adminUser._id,
        action: 'VENDOR_APPROVED',
        entityType: 'Vendor',
        entityId: vTitan._id,
        details: { companyName: vTitan.companyName, reason: 'MSME and ISO 9001 certifications verified' },
        ipAddress: '192.168.1.10',
      },
      {
        user: buyer1._id,
        action: 'PO_CREATED',
        entityType: 'PurchaseOrder',
        entityId: pos[0]._id,
        details: { poNumber: pos[0].poNumber, totalAmount: pos[0].totalAmount, vendor: vApex.companyName },
        ipAddress: '192.168.1.45',
      },
      {
        user: buyer4._id,
        action: 'PO_CREATED',
        entityType: 'PurchaseOrder',
        entityId: pos[2]._id,
        details: { poNumber: pos[2].poNumber, totalAmount: pos[2].totalAmount, vendor: vTitan.companyName },
        ipAddress: '192.168.1.48',
      },
      {
        user: buyer1._id,
        action: 'EVALUATION_SUBMITTED',
        entityType: 'Evaluation',
        entityId: evaluations[0]._id,
        details: { vendor: vApex.companyName, overallScore: 4.8, recommendation: 'Preferred' },
        ipAddress: '192.168.1.45',
      },
    ]);
    console.log('✅ Seeded Audit Logs.');

    console.log('🎉 VendorFlow Seeding Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('Default credentials for all users: Password123!');
    console.log('Admin  : admin@vendorflow.io');
    console.log('Buyers : buyer@vendorflow.io, elena.buyer@vendorflow.io, david.buyer@vendorflow.io, priya.buyer@vendorflow.io');
    console.log('Vendors: vendor.apex@example.com, vendor.cyber@example.com, vendor.titan@example.com, vendor.zenith@example.com, vendor.nova@example.com, vendor.freight@example.com');
    console.log('----------------------------------------------------');
    if (isStandalone) {
      await mongoose.disconnect();
      process.exit(0);
    }

    return {
      success: true,
      message: 'Seeded all users, buyers, vendors, purchase orders, and evaluations into MongoDB Atlas successfully!',
      counts: {
        users: users.length,
        vendors: 6,
        evaluations: evaluations.length,
      },
    };
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    if (isStandalone) {
      process.exit(1);
    }
    throw err;
  }
};

import { fileURLToPath } from 'url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seedDatabase(true);
}

