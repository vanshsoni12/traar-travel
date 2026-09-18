import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)

def create_traar_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom brand colors matching the TRAAR design system
    teal_dark = colors.HexColor('#0A2624')
    teal_primary = colors.HexColor('#0D9488')
    teal_light = colors.HexColor('#F0FDFA')
    amber_accent = colors.HexColor('#D97706')
    orange_accent = colors.HexColor('#EA580C')
    blue_accent = colors.HexColor('#0284C7')
    purple_accent = colors.HexColor('#7C3AED')
    red_alert = colors.HexColor('#DC2626')
    slate_dark = colors.HexColor('#0F172A')
    slate_body = colors.HexColor('#334155')
    slate_light = colors.HexColor('#F8FAFC')
    border_color = colors.HexColor('#E2E8F0')

    # Typography styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=teal_dark,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=teal_primary,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=teal_dark,
        spaceBefore=14,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=teal_primary,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=slate_body,
        spaceAfter=6
    )

    badge_style = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []

    # ==================== HEADER / HERO ====================
    header_table_data = [
        [
            Paragraph("<b>TRAAR</b> — Smart India Hackathon 2026", ParagraphStyle('Hdr1', fontName='Helvetica-Bold', fontSize=18, textColor=teal_dark)),
            Paragraph("<b>PILOT: BHOPAL, MP</b>", ParagraphStyle('Hdr2', fontName='Helvetica-Bold', fontSize=10, textColor=teal_primary, alignment=2))
        ]
    ]
    hdr_table = Table(header_table_data, colWidths=[360, 155])
    hdr_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(hdr_table)

    story.append(HRFlowable(width="100%", thickness=2, color=teal_primary, spaceBefore=4, spaceAfter=12))

    # Document Banner
    banner_p = Paragraph(
        "<b>Project Specification & UI Architecture Report</b><br/>"
        "<font size=8.5 color='#475569'>A production-grade, desktop-first responsive travel planning web application featuring real-time budget balancing, verified local services, and multimodal transport intelligence.</font>",
        ParagraphStyle('BannerP', fontName='Helvetica', fontSize=10, leading=14, textColor=slate_dark)
    )
    banner_table = Table([[banner_p]], colWidths=[515])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), teal_light),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#99F6E4')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 12))

    # ==================== 1. EXECUTIVE OVERVIEW ====================
    story.append(Paragraph("1. Executive Overview & Problem Statement", h1_style))
    p1 = ("Modern Indian travellers face highly fragmented platforms when discovering local destinations. "
          "Standard booking portals push sponsored listings, conceal public transportation options, "
          "and lack integrated itinerary budget calculators. <b>TRAAR</b> is built for the Smart India Hackathon 2026 "
          "to introduce transparent, verified tariffs across four foundational pillars: <b>Stays</b>, <b>Food</b>, "
          "<b>Places to Visit</b>, and <b>Nearby Trips</b>, powered by a persistent trip balancing engine.")
    story.append(Paragraph(p1, body_style))
    story.append(Spacer(1, 8))

    # ==================== 2. DESIGN SYSTEM & COLOR MATRIX ====================
    story.append(Paragraph("2. Design System & Category Accent Matrix", h1_style))
    
    color_table_data = [
        [
            Paragraph("<b>Category / Element</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Accent Color</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Hex Code</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Applied Context & UI Semantics</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white))
        ],
        [
            Paragraph("<b>Sidebar Shell</b>", body_style),
            Paragraph("Deep Navy Teal", body_style),
            Paragraph("#0A2624", ParagraphStyle('Mono', fontName='Courier-Bold', fontSize=8.5)),
            Paragraph("Fixed 235px navigation with SIH pilot badge and active filled pill", body_style)
        ],
        [
            Paragraph("<b>Stays</b>", body_style),
            Paragraph("Amber Gold", body_style),
            Paragraph("#D97706", ParagraphStyle('Mono', fontName='Courier-Bold', fontSize=8.5)),
            Paragraph("Hotels, hostels, PGs, dormitories, tariff units, and way-to modals", body_style)
        ],
        [
            Paragraph("<b>Food & Dining</b>", body_style),
            Paragraph("Vibrant Orange", body_style),
            Paragraph("#EA580C", ParagraphStyle('Mono', fontName='Courier-Bold', fontSize=8.5)),
            Paragraph("Bhopali delicacies, restaurants, cafes, dhabas, veg/non-veg chips", body_style)
        ],
        [
            Paragraph("<b>Places to Visit</b>", body_style),
            Paragraph("Royal / Sky Blue", body_style),
            Paragraph("#0284C7", ParagraphStyle('Mono', fontName='Courier-Bold', fontSize=8.5)),
            Paragraph("Heritage landmarks, lake vistas, entry tariffs, geo-map view", body_style)
        ],
        [
            Paragraph("<b>Nearby Trips</b>", body_style),
            Paragraph("Royal Purple", body_style),
            Paragraph("#7C3AED", ParagraphStyle('Mono', fontName='Courier-Bold', fontSize=8.5)),
            Paragraph("Regional excursions, distance badges, multimodal transport panel", body_style)
        ],
        [
            Paragraph("<b>Budget Warnings</b>", body_style),
            Paragraph("Crimson Red", body_style),
            Paragraph("#DC2626", ParagraphStyle('Mono', fontName='Courier-Bold', fontSize=8.5)),
            Paragraph("Warning banner: <i>'Tiny pause, you have reached your limit.'</i>", body_style)
        ]
    ]

    col_table = Table(color_table_data, colWidths=[105, 85, 75, 250])
    col_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), teal_dark),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, slate_light]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(col_table)
    story.append(Spacer(1, 14))

    # ==================== 3. 10 PAGES BREAKDOWN ====================
    story.append(Paragraph("3. Complete 10-Page Architecture Breakdown", h1_style))

    pages_data = [
        [
            Paragraph("<b>Page Name</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Core Features & Functional Components</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Key User Actions</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white))
        ],
        [
            Paragraph("<b>1. Home Page</b>", body_style),
            Paragraph("Hero with Bhopal Upper Lake sunset, destination dropdown selector, pilot notice, 4 category explore cards, popular cities.", body_style),
            Paragraph("Select State/City, Explore Destination, jump to categories.", body_style)
        ],
        [
            Paragraph("<b>2. Destination Overview</b>", body_style),
            Paragraph("Upper Lake panorama banner, history & culture summary, quick info cards (Best time, Language, Famous for, How to reach), video tour modal.", body_style),
            Paragraph("Watch video guide, explore category cards, review pilot data notes.", body_style)
        ],
        [
            Paragraph("<b>3. Stays</b>", body_style),
            Paragraph("3-column card grid of verified stays (Jehan Numa, Backpackers, PGs, Dorms), filter chips (Hotel, PG, Hostel), price & distance sliders, desktop My Trip summary panel.", body_style),
            Paragraph("View Details modal, Add to Trip, Way to Hotel modal, live subtotal.", body_style)
        ],
        [
            Paragraph("<b>4. Food</b>", body_style),
            Paragraph("Bhopali culinary directory (Manohar Dairy, ICH, Sharma Dhaba, Hakeem), Pure Veg / Non-Veg segmented toggle, average cost per person, desktop summary drawer.", body_style),
            Paragraph("Filter cuisines, Add to Trip, Way to Restaurant transit directions.", body_style)
        ],
        [
            Paragraph("<b>5. Places to Visit</b>", body_style),
            Paragraph("Segmented filters (Nearest First, Famous, Hidden Gems), list / geo-map view switch, attractions with verified entry tariffs and timings (Free to Rs. 50).", body_style),
            Paragraph("Interactive map pins, inspect operating hours, Add to Trip.", body_style)
        ],
        [
            Paragraph("<b>6. Nearby Trips</b>", body_style),
            Paragraph("Distance filters (within 50 km, 50-100 km, 200+ km), excursion cards (Sanchi, Bhimbetka, Bhojpur, Ujjain, Pachmarhi), interactive right transport panel (Bus, Train, Car).", body_style),
            Paragraph("Compare operator tariffs, first/last departure, Add transport to trip.", body_style)
        ],
        [
            Paragraph("<b>7. My Trip Planner</b>", body_style),
            Paragraph("Parameters bar (dates, travellers, entered budget), itemized rows with steppers (+/-), line subtotals, over-budget warning banner, review checkbox, Export Trip Estimate.", body_style),
            Paragraph("Balance budget, export PDF estimate, share trip link, adjust quantities.", body_style)
        ],
        [
            Paragraph("<b>8. Provider Dashboard</b>", body_style),
            Paragraph("Status KPI metrics (All, Approved, Pending Review, Rejected, Draft, Withdrawn), listings management table with status pills, search & category filters.", body_style),
            Paragraph("Create New Listing CTA, preview listing, withdraw/delete service.", body_style)
        ],
        [
            Paragraph("<b>9. Add Service Wizard</b>", body_style),
            Paragraph("4-step form (Basic Info, Pricing & Units, Additional Info, Photos & Verification), right-side progress tracker (0-100%), SIH validation tips.", body_style),
            Paragraph("Save as Draft, Preview Modal, Submit for Review (live updates dashboard).", body_style)
        ],
        [
            Paragraph("<b>10. Help Booth</b>", body_style),
            Paragraph("Instant search bar, 9 FAQ accordions covering all requirements (selection, filters, freshness, budget, privacy), official SIH ticket support modal.", body_style),
            Paragraph("Search help articles, expand FAQ answers, submit support query.", body_style)
        ]
    ]

    pages_table = Table(pages_data, colWidths=[95, 275, 145])
    pages_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), teal_dark),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, slate_light]),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(pages_table)
    story.append(Spacer(1, 14))

    # ==================== 4. EMBEDDED DESIGN MOCKUP ====================
    story.append(Paragraph("4. Production UI Screen Designs (SIH 2026 Reference)", h1_style))
    img_path = "/Users/vanshsoni/.gemini/antigravity/brain/3836d9f0-6d51-4321-a505-7bedfe82e74b/.user_uploaded/media_1789592795605.jpg"
    if os.path.exists(img_path):
        # 515 pt wide, maintain aspect ratio
        story.append(Image(img_path, width=515, height=270))
        story.append(Paragraph("<font size=7.5 color='#64748B'>Figure 1: Full 10-screen UI layout rendered across Home, Overview, Stays, Food, Places, Nearby, My Trip, Provider Dashboard, Add Service, and Help Booth.</font>", ParagraphStyle('Cap', fontName='Helvetica-Oblique', alignment=1, spaceBefore=4)))
    story.append(Spacer(1, 14))

    # ==================== 5. BUDGET FORMULAS & LIMIT LOGIC ====================
    story.append(Paragraph("5. Dynamic Budget Balancing Engine & Alert Logic", h1_style))
    calc_desc = (
        "The application maintains real-time mathematical consistency across all itinerary modifications. "
        "The grand total is dynamically computed as:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>Grand Total = Total Stays + Total Food + Total Attractions + Total Transport</b><br/>"
        "Where:<br/>"
        "• <b>Total Stays</b> = &Sigma; (Room / Bed Tariff &times; Duration &times; Quantity)<br/>"
        "• <b>Total Food</b> = &Sigma; (Average Spend per Person &times; Travellers &times; Meals)<br/>"
        "• <b>Total Attractions</b> = &Sigma; (Verified Entry Fee &times; Number of Visitors)<br/>"
        "• <b>Total Transport</b> = &Sigma; (Fare per Passenger / Vehicle &times; Booked Slots)<br/>"
        "<br/>"
        "<b>Over-Budget Alert Condition:</b><br/>"
        "Whenever <code>Grand Total &gt; Entered Target Budget</code>, an inline red warning banner renders reactively:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<font color='#DC2626'><b>⚠️ Tiny pause, you have reached your limit.</b></font><br/>"
        "Displaying the exact variance deficit without triggering disruptive browser modal dialogs."
    )
    story.append(Paragraph(calc_desc, body_style))
    story.append(Spacer(1, 12))

    # ==================== 6. VERIFICATION & TEST SUMMARY ====================
    story.append(Paragraph("6. Engineering Verification & Build Audit", h1_style))
    audit_data = [
        [
            Paragraph("<b>Verification Check</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Target Metric</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Observed Result</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Status</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white))
        ],
        [
            Paragraph("Vite Production Build", body_style),
            Paragraph("Zero errors / clean bundle", body_style),
            Paragraph("1,898 modules transformed in 766ms", body_style),
            Paragraph("<b>PASSED</b>", ParagraphStyle('P', fontName='Helvetica-Bold', textColor=colors.HexColor('#16A34A')))
        ],
        [
            Paragraph("Development Server", body_style),
            Paragraph("Port 5173 host bound", body_style),
            Paragraph("Ready in 62ms at http://localhost:5173/", body_style),
            Paragraph("<b>ONLINE</b>", ParagraphStyle('P', fontName='Helvetica-Bold', textColor=colors.HexColor('#16A34A')))
        ],
        [
            Paragraph("In-Browser PDF Generator", body_style),
            Paragraph("jsPDF + html2canvas", body_style),
            Paragraph("Generates downloadable A4 estimate with disclaimer", body_style),
            Paragraph("<b>PASSED</b>", ParagraphStyle('P', fontName='Helvetica-Bold', textColor=colors.HexColor('#16A34A')))
        ],
        [
            Paragraph("Responsive Layout", body_style),
            Paragraph("Desktop, Tablet, Mobile", body_style),
            Paragraph("Fixed 235px sidebar with mobile drawer conversion", body_style),
            Paragraph("<b>PASSED</b>", ParagraphStyle('P', fontName='Helvetica-Bold', textColor=colors.HexColor('#16A34A')))
        ]
    ]
    audit_table = Table(audit_data, colWidths=[130, 115, 195, 75])
    audit_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), teal_dark),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, slate_light]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(audit_table)
    story.append(Spacer(1, 16))

    # Footer note
    footer_p = Paragraph(
        "<b>Smart India Hackathon 2026 Submission Document</b> — Prepared for Ministry of Tourism & Hackathon Evaluation Desk.<br/>"
        "TRAAR Platform v1.0 • Built with React, Vite & Tailwind CSS • Pilot Destination: Bhopal, Madhya Pradesh.",
        ParagraphStyle('Ftr', fontName='Helvetica', fontSize=8, textColor=colors.HexColor('#64748B'), alignment=1)
    )
    story.append(footer_p)

    doc.build(story)
    print(f"Successfully generated PDF report at: {output_path}")

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'TRAAR_SIH_2026_Project_Presentation.pdf'
    create_traar_pdf(out)
