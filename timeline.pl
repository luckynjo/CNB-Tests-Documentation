#!/usr/local/bin/perl

use JSON;
use Cwd;
use WebCNP::Config;
use WWW::Auth;
use WWW::Auth::DB;
require 'webcnp_lib.pl';
use strict;
use warnings;
=pod

=head1 DESCRIPTION
This module handles Z Score CRUD. The code herein is for creating, reading, updating and deleting surveys. It functions as both model and controller. All viewing functions will be handled by the views themselves. In a way, the hope is to move towards an MVC architecture.
All other modules will be left as they are unless we are given permission to refactor them as well.

=cut

my ($cgi, $CONFIG, $DEBUG, $template, $datetime, $db, $server_type, $server_name) = &init_webcnp('timeline.pl');


my $dbh = $db->{_dbh};

my %vars = (
    CONFIG => $CONFIG,
    server_type => $server_type,
    server_name => $server_name,
    server_url => $CONFIG->{server}->{url},
    script => 'timeline.pl'
);

# only returns upon successful authentication
#my ($adminid, $http_header_hashref) = check_login($cgi, \%vars, 'zscores', $template, 'zscores.pl', $db);
my %invalid_request = ("status" => 400, "message" => "There was an error processing your request. Please try again later.");
my %success_request = ("status" => 200, "message" => "Content was updated successfully.");
my $raw_data = $cgi->param('POSTDATA');
if(!$raw_data)
{
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%invalid_request);
  exit;
}

my $data = decode_json($raw_data);
print STDERR "Data ke " . $data;

my $action = $data->{op};
my $test_version_id = $data->{id};

if($action eq "view")
{
  my $timeline = get_test_document($test_version_id);
  my %results = (
     timeline => $timeline
  );
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%results);
}
elsif($action eq "ust")
{
  my $id = $data->{id};
  my $lang = $data->{language};
  my $section_id = $data->{sid};
  my $text = $data->{text};
  update_section_text($id, $section_id, $lang, $text);
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%success_request);
}
elsif($action eq "vst")
{
  my $id = $data->{id};
  my $lang = $data->{language};
  my $timeline = view_timeline_section($id, $lang);
  my %results = (
     section_text => $timeline
  );
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%results);
}
elsif($action eq "save")
{
  my $timeline = get_test_document($test_version_id);
  my %results = (
     timeline => $timeline
  );
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%results);
}
else
{


  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%invalid_request);
}


sub get_test_document
{
  my $test_version_id = shift;

  # Get all the sections for a given test.
  my $stmt = "SELECT * FROM test_documents WHERE test_version_id = ? ORDER BY section_number";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  my @variable_bindings = ();
  push(@variable_bindings, $test_version_id);

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @timeline = ();
  #my $section;
  while(my $section = $query->fetchrow_hashref)
  {
    print STDERR "Found session " . $section->{title} . "\n";
    push(@timeline, $section);
  }
  $query->finish;
  return \@timeline;
}

sub view_timeline_section
{
  my $id = shift;
  my $language = shift;
  # Get all the sections for a given test.
  my $stmt = "SELECT * FROM test_documents_text WHERE id = ? AND language = ? ";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  my @variable_bindings = ($id, $language);

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @sections = ();
  #my $section;
  while(my $section = $query->fetchrow_hashref)
  {
    print STDERR "Found session " . $section->{title} . "\n";
    push(@sections, $section);
  }
  $query->finish;
  return \@sections;
}

sub save_timeline
{
  my $test_version_id = shift;
  my $timeline = shift;

  #my $test_version_id = shift;

  # Get all the sections for a given test.
  my $stmt = "INSERT INTO test_documents(test_version_id, title, section_number) VALUES(?, ?, ?)";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  my $count = 1;
  for my $section(@$timeline)
  {
    my @variable_bindings = ($test_version_id, $section, $count);

    $query->execute(@variable_bindings);
    $count++;
    if($query->errstr())
    {
        print STDERR "DB error during execute statement ".$query->errstr()."\n";
        on_error(\%invalid_request);
    }
  }
  $query->finish;
  $dbh->commit;
}

sub update_section_text
{
  my ($id, $section_id, $lang, $text) = @_;

  print STDERR "Given id $id, section id $section_id, language $lang, and content " . $text . "\n";
  my $stmt = "UPDATE test_documents_text set content = ? WHERE id = ? AND section_id = ? AND language = ?";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  my @variable_bindings = (JSON::XS->new->encode($text), $id, $section_id, $lang);

  $query->execute(@variable_bindings);

  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }
  $query->finish;
  $dbh->commit;
}

sub on_error
{
  my $error = shift;
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\$error);
}
1;
