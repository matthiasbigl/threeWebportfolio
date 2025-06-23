# EmailJS Templates

This folder contains HTML email templates for the contact form system.

## Templates

### 1. `contact-form-template.html`
**Purpose:** Main template for receiving contact form submissions  
**Used by:** Matthias (you) to receive new contact messages  
**Variables:** 
- `{{from_name}}` - Name of the person contacting you
- `{{from_email}}` - Email address of the person contacting you  
- `{{message}}` - The message content
- `{{timestamp}}` - When the message was sent

### 2. `auto-reply-template.html`
**Purpose:** Automatic confirmation email sent to people who contact you  
**Used by:** Automatic response to the person who submitted the form  
**Variables:**
- `{{from_name}}` - Name of the person who contacted you
- `{{timestamp}}` - When the message was sent

## EmailJS Setup Instructions

### Step 1: Create EmailJS Templates

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to "Email Templates" 
3. Create two new templates:

#### Template 1: Contact Form (for you to receive messages)
- **Template ID:** `template_contact_form` (or your choice)
- **Subject:** `New Contact Message from {{from_name}}`
- **Content:** Copy and paste `contact-form-template.html`

#### Template 2: Auto Reply (confirmation for sender)
- **Template ID:** `template_auto_reply` (or your choice)  
- **Subject:** `Thank you for contacting Matthias Bigl`
- **Content:** Copy and paste `auto-reply-template.html`

### Step 2: Update Environment Variables

Update your `.env` file with:
```bash
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=template_contact_form  # Main template ID
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

### Step 3: Configure Auto-Reply (Optional)

If you want to send auto-replies, you'll need to:
1. Set up a second EmailJS service call in your `+page.server.ts`
2. Use the auto-reply template ID
3. Send to `{{from_email}}` instead of your email

## Design Features

Both templates match your portfolio's design system:
- **Dark glassmorphic theme** with blue/purple gradients
- **Responsive design** that works on mobile and desktop
- **Animated elements** like shimmer effects and pulse animations
- **Professional typography** using system fonts
- **Accessible color contrast** and proper semantic HTML
- **Modern CSS Grid/Flexbox** layout

## Template Variables

Make sure these variables are included in your EmailJS template configuration:

### Contact Form Template Variables:
- `from_name`
- `from_email` 
- `message`
- `timestamp`

### Auto-Reply Template Variables:
- `from_name`
- `timestamp`

## Customization

You can customize:
- Colors in the CSS variables
- Text content and messaging
- Social media links
- Contact information
- Animation timings
- Typography styles

The templates are designed to be easily maintainable and match your portfolio's aesthetic perfectly!
