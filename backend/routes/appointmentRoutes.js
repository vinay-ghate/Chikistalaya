import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import supabase from '../supabase.js';

const router = express.Router();

// Create a new appointment
router.post('/book', authenticateUser, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (userError) {
      console.error('Failed to fetch user from Supabase:', userError);
      return res.status(500).json({ error: 'Supabase user fetch failed' });
    }
    if (!userRecord) {
      // If user does not exist in Supabase, either create them or return error:
      return res.status(404).json({ error: 'User not found in Supabase' });
    }
    const { data: supabaseAppointment, error: apptError } = await supabase
      .from('appointments')
      .insert({
        user_id: userRecord.id,              // link to the user
        provider_id: req.body.provider_id,   // or whatever your "doctor" ID is
        start_time: req.body.start_time,     // must be a date/time format
        notes: req.body.notes ?? null,
        provider_name: req.body.provider_name,
      })
      .single();

    if (apptError) {
      console.error('Failed to insert appointment into Supabase:', apptError);
      return res.status(500).json({ error: 'Supabase appointment insert failed' });
    }

    // 5) Return combined result or whatever you prefer
    return res.json({
      message: 'Appointment created successfully',
      supabaseAppointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create appointment' });

  }
});

router.get('/recent', authenticateUser, async (req, res) => {
  try {
    // Query Supabase for the 3 most recently created appointments
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })  // Sort by created_at descending
      .limit(3);                                  // Limit to 3

    if (error) {
      console.error('Error fetching recent appointments:', error);
      return res.status(500).json({ error: 'Failed to fetch recent appointments' });
    }

    return res.json({
      message: 'Fetched 3 most recent appointments',
      data: data, // the 3 appointments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;